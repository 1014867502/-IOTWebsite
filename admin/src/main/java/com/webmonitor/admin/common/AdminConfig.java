package com.webmonitor.admin.common;

import com.alibaba.druid.filter.stat.StatFilter;
import com.alibaba.druid.wall.WallFilter;
import com.jfinal.config.Constants;
import com.jfinal.config.Handlers;
import com.jfinal.config.Interceptors;
import com.jfinal.config.Plugins;
import com.jfinal.config.Routes;
import com.jfinal.core.JFinal;
import com.jfinal.i18n.I18nInterceptor;
import com.jfinal.json.MixedJsonFactory;
import com.jfinal.kit.PathKit;
import com.jfinal.log.Log;
import com.jfinal.plugin.activerecord.ActiveRecordPlugin;
import com.jfinal.plugin.druid.DruidPlugin;
import com.jfinal.plugin.ehcache.EhCachePlugin;
import com.jfinal.template.Engine;
import com.webmonitor.admin.account.AccountController;
import com.webmonitor.admin.common.assistThread.TimerClearDiskFileThread;
import com.webmonitor.admin.common.assistThread.TimerClearFileThread;
import com.webmonitor.admin.common.interceptor.LoginSessionInterceptor;
import com.webmonitor.admin.common.kit.APP;
import com.webmonitor.admin.auth.AuthKit;
import com.webmonitor.admin.company.CompanyController;
import com.webmonitor.admin.devicelist.DeviceController;
import com.webmonitor.admin.directive.LabelDirective;
import com.webmonitor.admin.directive.PermissionDirective;
import com.webmonitor.admin.directive.RadioDirective;
import com.webmonitor.admin.directive.RoleDirective;
import com.webmonitor.admin.directive.SelectDirective;
import com.webmonitor.admin.directive.StoreSelectDirective;
import com.webmonitor.admin.directive.TableBadgeDirective;
import com.webmonitor.admin.directive.TableLabelDirective;
import com.webmonitor.admin.index.IndexController;
import com.webmonitor.admin.manage.ManagerController;
import com.webmonitor.admin.overview.OverviewController;

import com.webmonitor.admin.role.RoleController;
import com.webmonitor.core.config.JfinalCoreConfig;
import com.webmonitor.core.config.kit.StartInit;
import com.webmonitor.core.model._MappingKit;
import com.webmonitor.core.util.Tools;

import java.io.*;
import java.sql.Connection;

public class AdminConfig extends JfinalCoreConfig {
    private WallFilter wallFilter;
    private TimerClearFileThread clearfileThread = null ;
    private TimerClearDiskFileThread cleardiskThread = null ;

    static Log log = Log.getLog(AdminConfig.class);

    public static void main(String[] args) {
        JFinal.start("admin/src/main/webapp", 8000, "/");
    }

    @Override
    public void configConstant(Constants me) {
        me.setI18nDefaultBaseName("i18n");
        me.setI18nDefaultLocale("en_US");
        StartInit.initConfig(props);
        me.setDevMode(Tools.getConfigBool("devMode", false));
        me.setJsonFactory(MixedJsonFactory.me());

        String uploadpath = Tools.getConfig("app_workspace_path","/");

        if (uploadpath.length()>1)
        {
            File dir = new File(uploadpath);
            dir.mkdirs();
        }

        me.setBaseUploadPath(uploadpath);

        // 支持 Controller、Interceptor 之中使用 @Inject 注入业务层，并且自动实现 AOP
        me.setInjectDependency(true);

    }

    @Override
    public void configRoute(Routes me) {
        me.setBaseViewPath("/_view");
        me.add("/", IndexController.class);
        me.add("/overview", OverviewController.class);
        me.add("/manage", ManagerController.class);
        me.add("/devicelist", DeviceController.class);
        //me.add("/account", AccountController.class);
        me.add("/role", RoleController.class);
        me.add("/company", CompanyController.class);
        //me.add("/permission", PermissionController.class);
        //业务路由
    }

    @Override
    public void configEngine(Engine me) {
        // devMode 配置为 true，将支持模板实时热加载
        me.setDevMode(Tools.getConfigBool("engineDevMode", false));
        //配置指令
        me.addDirective("role", RoleDirective.class);
        me.addDirective("permission", PermissionDirective.class);
        me.addDirective("select", SelectDirective.class);
        me.addDirective("radio", RadioDirective.class);
        me.addDirective("tableBadge", TableBadgeDirective.class);
        me.addDirective("tableLabel", TableLabelDirective.class);
        me.addDirective("label", LabelDirective.class);
        //配置业务指令
        me.addDirective("storeselect", StoreSelectDirective.class);
        //
        me.addSharedMethod(AuthKit.class);
        me.addSharedObject("APP", APP.getInstance());
        me.addSharedObject("Tools", new Tools());
        me.addSharedFunction("/_view/_common/_meta.html");
    }

    public static DruidPlugin getDruidPlugin() {

        return new DruidPlugin(Tools.getConfig("jdbcUrl"), Tools.getConfig("user"), Tools.getConfig("password").trim());
//        if (Tools.isEmpty(Tools.getConfig("jdbcdriverClassName")))
//        {
//            return new DruidPlugin(Tools.getConfig("jdbcUrl"), Tools.getConfig("user"), Tools.getConfig("password").trim());
//        }
//        else
//        {
//            return new DruidPlugin(Tools.getConfig("jdbcUrl"), Tools.getConfig("user"), Tools.getConfig("password").trim(),
//                    Tools.getConfig("jdbcdriverClassName"));
//        }
    }

    @Override
    public void configPlugin(Plugins me) {

        if (Tools.getConfig("jdbcdriverClassName").contains("mysql"))
        {
            DruidPlugin druidPlugin = getDruidPlugin();
            wallFilter = new WallFilter();              // 加强数据库安全
            wallFilter.setDbType("mysql");

            me.add(druidPlugin);

            ActiveRecordPlugin arp = new ActiveRecordPlugin(druidPlugin);
            //arp.setTransactionLevel(Connection.TRANSACTION_READ_COMMITTED);
            arp.setTransactionLevel(Connection.TRANSACTION_SERIALIZABLE);
            _MappingKit.mapping(arp);
            me.add(arp);

            me.add(new EhCachePlugin());
        }
        else if (Tools.getConfig("jdbcdriverClassName").contains("sqlite"))
        {
            //加载sqlite的驱动,其他操作和mysql的一样
//            String dbPath = readDBfilePath();
//            if (Tools.isEmpty(dbPath))
//                return;
//            dbPath = dbPath+"dbfile\\";

            String dbPath;
            dbPath = Tools.getConfig("app_workspace_path","/");

            log.info(dbPath);
            DruidPlugin druidPlugin = new DruidPlugin(String.format(Tools.getConfig("jdbcUrl"), dbPath),
                    Tools.getConfig("user"), Tools.getConfig("password").trim());
            druidPlugin.setDriverClass("org.sqlite.JDBC");

            me.add(druidPlugin);

            ActiveRecordPlugin arp = new ActiveRecordPlugin(druidPlugin);
            //arp.setTransactionLevel(Connection.TRANSACTION_READ_COMMITTED);
            arp.setTransactionLevel(Connection.TRANSACTION_SERIALIZABLE);
            _MappingKit.mapping(arp);
            me.add(arp);

            me.add(new EhCachePlugin());
        }
//        DruidPlugin druidPluginPG = new DruidPlugin(Tools.getConfig("postgrejdbcUrl"),
//                Tools.getConfig("postgreUser"), Tools.getConfig("postgrePassword").trim());
//        me.add(druidPluginPG);
//
//        ActiveRecordPlugin arp2 = new ActiveRecordPlugin("postgresql",druidPluginPG);
//        arp2.setDialect(new PostgreSqlDialect());
//        //_MappingKit.mapping(arp2);
//        me.add(arp2);

    }

    @Override
    public void configInterceptor(Interceptors me) {

        me.add(new LoginSessionInterceptor());
        //先将I18nInterceptor配置成全局拦截器
        me.add(new I18nInterceptor());

    }

    @Override
    public void configHandler(Handlers me) {

    }

    public void afterJFinalStart() {
        // 让 druid 允许在 sql 中使用 union
        // https://github.com/alibaba/druid/wiki/%E9%85%8D%E7%BD%AE-wallfilter
        //wallFilter.getConfig().setSelectUnionCheck(false);
//        clearfileThread = new TimerClearFileThread();
//        clearfileThread.start();
//        cleardiskThread = new TimerClearDiskFileThread();
//        cleardiskThread.start();
    }
    public void beforeJFinalStop() {
        if (clearfileThread != null) {
            clearfileThread.interrupt();
        }
        if (cleardiskThread != null) {
            cleardiskThread.interrupt();
        }
    }
    public String readDBfilePath()
    {
        int position=0;
        String[] bufstring=new String[1024];
        //打开带读取的文件
        String line=null;
        BufferedReader br = null;
        try {
            br = new BufferedReader(new FileReader("E:\\runpath.txt"));

            while((line=br.readLine())!=null) {
                bufstring[position]=line;
                position++;
                break;
            }
            br.close();//关闭文件
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return line;
    }
}
