package com.webmonitor.core.dal;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.webmonitor.core.bll.StaffService;
import com.webmonitor.core.idal.IProject;

import com.webmonitor.core.model.AgentData;
import com.webmonitor.core.model.ProjectPage;
import com.webmonitor.core.model.ProjectsData;
import com.webmonitor.core.model.StaffData;
import com.webmonitor.core.model.userbase.BaseProjects;
import com.webmonitor.core.util.Tools;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

public class ProjectMysqlDAL implements IProject {
    StaffService staffService=new StaffService();

    @Override
    /**获取所有**/
    public List<BaseProjects> getAllProjects() {
        List<BaseProjects> list=new ArrayList<>();
        String sql="select a.*, b.agentName from projects_data a ,agent_table b where a.agentNumber=b.agentNumber";
        List<Record> record= Db.find(sql);
        for(Record item:record){
            BaseProjects baseProjects=new BaseProjects();
            baseProjects.setId(item.getStr("id"));
            baseProjects.setCreatetime(item.getStr("createTime"));
            baseProjects.setAgentname(item.getStr("agentName"));
            baseProjects.setProjectid(item.getStr("proGroupId"));
            baseProjects.setProgroupname(item.getStr("proGroupName"));
            sql="select count(*) from agent_data where proGroupId='"+item.getStr("proGroupId")+"'";
            Record  record1=Db.findFirst(sql);
            baseProjects.setDevicenum(record1.getInt("count(*)"));
            list.add(baseProjects);
        }
        return list;
    }

    /**通过项目id获取项目**/
    @Override
    public BaseProjects getProjectById(String projectid) {
        String sql="select a.*, b.agentName from projects_data a ,agent_table b where a.agentNumber=b.agentNumber" +
                " and a.proGroupId='"+projectid+"'";
        Record record= Db.findFirst(sql);
        BaseProjects baseProjects=new BaseProjects();
        baseProjects.setId(record.getStr("id"));
        baseProjects.setCreatetime(record.getStr("createTime"));
        baseProjects.setAgentname(record.getStr("agentName"));
        baseProjects.setProjectid(record.getStr("proGroupId"));
        baseProjects.setProgroupname(record.getStr("proGroupName"));
        baseProjects.setAgentnumber(record.getStr("agentNumber"));
        sql="select count(*) from agent_data where proGroupId="+projectid;
        record=Db.findFirst(sql);
        baseProjects.setDevicenum(record.getInt("count(*)"));
        return baseProjects;
    }


    @Override
    public BaseProjects getProjectByName(String projectname) {
        String sql="select a.*, b.agentName from projects_data a ,agent_table b where a.agentNumber=b.agentNumber" +
                " and a.proGroupName='"+projectname+"'";
        Record record= Db.findFirst(sql);
        BaseProjects baseProjects=new BaseProjects();
        baseProjects.setId(record.getStr("id"));
        baseProjects.setCreatetime(record.getStr("createTime"));
        baseProjects.setAgentname(record.getStr("agentName"));
        baseProjects.setProjectid(record.getStr("proGroupId"));
        baseProjects.setProgroupname(record.getStr("proGroupName"));
        baseProjects.setAgentnumber(record.getStr("agentNumber"));
        sql="select count(*) from agent_data where proGroupId="+record.getStr("proGroupId");
        record=Db.findFirst(sql);
        baseProjects.setDevicenum(record.getInt("count(*)"));
        return baseProjects;
    }

    @Override/**根据企业编号进行查询**/
    public List<BaseProjects> getProjectsByComId(String id) {
        List<BaseProjects> list=new ArrayList<>();
        String sql="select a.*, b.agentName from projects_data a ,agent_table b where a.agentNumber=b.agentNumber and "
                +" a.agentNumber='"+id+"'";
        List<Record> record= Db.find(sql);
        for(Record item:record){
            BaseProjects baseProjects=new BaseProjects();
            baseProjects.setId(item.getStr("id"));
            baseProjects.setCreatetime(item.getStr("createTime"));
            baseProjects.setAgentname(item.getStr("agentName"));
            baseProjects.setProjectid(item.getStr("proGroupId"));
            baseProjects.setProgroupname(item.getStr("proGroupName"));
            sql="select count(*) from agent_data  where proGroupId="+item.getStr("proGroupId");
            Record  record1=Db.findFirst(sql);
            baseProjects.setDevicenum(record1.getInt("count(*)"));
            list.add(baseProjects);
        }
        return list;
    }

    @Override
    public Page<Object> getProjectsPageData(int pageno, int limit) {
        List<BaseProjects> list=new ArrayList<>();
        String sql="from projects_data a ,agent_table b where a.agentNumber=b.agentNumber";
        Page<Record> page=Db.paginate(pageno,limit,"select a.*, b.agentName ",sql);
        List<Record> record= page.getList();
        for(Record item:record){
            BaseProjects baseProjects=new BaseProjects();
            baseProjects.setId(item.getStr("id"));
            baseProjects.setCreatetime(item.getStr("createTime"));
            baseProjects.setAgentname(item.getStr("agentName"));
            baseProjects.setProjectid(item.getStr("proGroupId"));
            baseProjects.setProgroupname(item.getStr("proGroupName"));
            sql="select count(*) from agent_data where proGroupId='"+item.getStr("proGroupId")+"'";
            Record  record1=Db.findFirst(sql);
            baseProjects.setDevicenum(record1.getInt("count(*)"));
            list.add(baseProjects);
        }
        return new Page<Object>(Collections.singletonList(list),page.getPageNumber(), page.getPageSize(), page.getTotalPage(), page.getTotalRow());
    }

    @Override
    public Page<BaseProjects> getProjectsByComIdPageData(String comid, int pageno, int limit) {
        List<BaseProjects> list=new ArrayList<>();
        String sql=" from projects_data a ,agent_table b where a.agentNumber=b.agentNumber and "
                +" a.agentNumber="+comid+"";
        Page<Record> page=Db.paginate(pageno,limit,"select  a.*, b.agentName ",sql);
        List<Record> record= page.getList();
        for(Record item:record){
            BaseProjects baseProjects=new BaseProjects();
            baseProjects.setId(item.getStr("id"));
            baseProjects.setCreatetime(item.getStr("createTime"));
            baseProjects.setAgentnumber(item.getStr("agentNumber"));
            baseProjects.setAgentname(item.getStr("agentName"));
            baseProjects.setProjectid(item.getStr("proGroupId"));
            baseProjects.setProgroupname(item.getStr("proGroupName"));
            sql="select count(*) from agent_data a,machine_data b where a.machineSerial=b.machineSerial and a.proGroupId="+item.getStr("proGroupId");
            Record  record1=Db.findFirst(sql);
            baseProjects.setDevicenum(record1.getInt("count(*)"));
            list.add(baseProjects);
        }
        return new Page<BaseProjects>(list,page.getPageNumber(), page.getPageSize(), page.getTotalPage(), page.getTotalRow());
    }

    public Page<Object> getProjectsByComIdPageDataO(String comid, int pageno, int limit) {
        List<BaseProjects> list=new ArrayList<>();
        String sql=" from projects_data a ,agent_table b where a.agentNumber=b.agentNumber and "
                +" a.agentNumber="+comid+"";
        Page<Record> page=Db.paginate(pageno,limit,"select  a.*, b.agentName ",sql);
        List<Record> record= page.getList();
        for(Record item:record){
            BaseProjects baseProjects=new BaseProjects();
            baseProjects.setId(item.getStr("id"));
            baseProjects.setCreatetime(item.getStr("createTime"));
            baseProjects.setAgentnumber(item.getStr("agentNumber"));
            baseProjects.setAgentname(item.getStr("agentName"));
            baseProjects.setProjectid(item.getStr("proGroupId"));
            baseProjects.setProgroupname(item.getStr("proGroupName"));
            sql="select count(*) from agent_data a,machine_data b where a.machineSerial=b.machineSerial and a.proGroupId="+item.getStr("proGroupId");
            Record  record1=Db.findFirst(sql);
            baseProjects.setDevicenum(record1.getInt("count(*)"));
            list.add(baseProjects);
        }
        return new Page<Object>(Collections.singletonList(list),page.getPageNumber(), page.getPageSize(), page.getTotalPage(), page.getTotalRow());
    }

    /**获取用户项目数量**/
    @Override
    public int getProjectCountById(String type,String comid) {
        int count = 0;
        Record record=new Record();
        String sql="";
        switch (type){
            case "company":
                sql="select count(*) from projects_data where agentNumber="+comid;
                break;
            case "admin":
                sql="select count(*) from projects_data";
                break;
        }
        record=Db.findFirst(sql);
        count=record.getInt("count(*)");
        return count;
    }

    @Override
    public void addProject(String userid,String comid, String projectname,String proLatitude,String proLongitude) {
        int id=1;
        ProjectsData projectsData=ProjectsData.dao.findFirst("SELECT * FROM projects_data  ORDER BY Id DESC limit 0,1");
        if(projectsData!=null){
            id=projectsData.getId()+1;
        }
        String sid=String.valueOf(id);
        Date date=new Date();
        DateFormat format=new SimpleDateFormat("yyyy-MM-dd");
        String time=format.format(date);
        Record group=new Record().set("proGroupId",id).set("proGroupName",projectname)
                .set("agentNumber",comid).set("createTime",time).set("proLongitude",proLongitude).set("proLatitude",proLatitude);
        Db.save("projects_data",group);
        staffService.updateauthor(userid,sid);
    }


    @Override
    public void deleteProject(String Projectid) {
        Db.delete("delete from projects_data where proGroupId="+Projectid);
       Db.update("update agent_data set proGroupId = 0,agentNumber=1 where proGroupId=?",Projectid);
    }


    @Override
    public void editproject(String projectid, String comid, String projctname) {
        Record group = Db.findFirst("select * from projects_data where proGroupId=" + projectid);
        group.set("proGroupId", projectid).set("proGroupName", projctname).set("agentNumber", comid);
        Db.update("projects_data", group);
    }

    /**获取项目里设备的数目**/
    @Override
    public int getProDevCountById(String projectid) {
        Record count=Db.findFirst("select count(*) from agent_data a left join machine_data b on a.machineSerial=b.machineSerial where a.proGroupId="+projectid);
        int sum=count.getInt("count(*)");
        return sum;
    }

    /**获取项目里在线设备的数目**/
    @Override
    public int getProDevOnCountById(String projectid) {
        Record count=Db.findFirst("select count(*) from agent_data a left join machine_data b on a.machineSerial=b.machineSerial where b.connectState=1 and a.proGroupId="+projectid);
        int sum=count.getInt("count(*)");
        return sum;
    }

    /**获取项目里离线设备的数目**/
    @Override
    public int getProDevOutCountById(String projectid) {
        Record count=Db.findFirst("select count(*) from agent_data a left join machine_data b on a.machineSerial=b.machineSerial where (b.connectState=0 or b.connectState is null) and a.proGroupId="+projectid);
        int sum=count.getInt("count(*)");
        return sum;
    }

    /**获取项目里最新导入设备的数目**/
    @Override
    public int getProDevNewCountById(String projectid) {
        Record count=Db.findFirst("select count(*) from agent_data a left join machine_data b on a.machineSerial=b.machineSerial where DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= date(a.createTime)  and a.proGroupId="+projectid);
        int sum=count.getInt("count(*)");
        return sum;
    }


    /**根据用户id获取项目**/
    public Page<BaseProjects> getProjectsById(String userid,int pageno,int limit){
        StaffData staffData=staffService.getStaffByName(userid);
        List<BaseProjects> projectsData=new ArrayList<>();
        String[] author=staffData.getGroupAssemble().split("@");
        for(int i=0;i<author.length;i++){
            BaseProjects projectsData1=getProjectById(author[i]);
            projectsData.add(projectsData1);
        }
        return new Page<BaseProjects>(projectsData,pageno,limit,(author.length/limit)+1 , author.length);
    }

    /**搜索用户所属项目**/
    public Page<BaseProjects> seekProjectsById(String userid,String content,int pageno,int limit) {
        StaffData staffData = staffService.getStaffByName(userid);
        String[] author = staffData.getGroupAssemble().split("@");
        String sql = "  from projects_data a ,agent_table b where a.agentNumber=b.agentNumber ";
        for (int i = 0; i < author.length; i++) {
            if (i != 0) {
                sql += " or a.proGroupId='" + author[i] + "'";
            } else {
                sql += " and (a.proGroupId='" + author[i] + "'";
            }
        }
        sql+=" ) ";
        if (!content.equals("")) {
            sql += " and proGroupName like '%" + content + "%'";
        }
            Page<Record> page = Db.paginate(pageno, limit, "select a.*, b.agentName  ", sql + " order by a.createTime desc");
            List<Record> recordList = page.getList();
            List<BaseProjects> rslist = new ArrayList<>();
            for (Record record : recordList) {
                BaseProjects map = new BaseProjects();
                map.setProjectid(record.getStr("proGroupId"));
                map.setProgroupname(record.getStr("proGroupName"));
                map.setCreatetime(record.getStr("createTime").replace('/', '-'));
                map.setAgentnumber(record.getStr("agentNumber"));
                map.setAgentname(record.getStr("agentName"));
                sql="select count(*) from agent_data where proGroupId="+record.getStr("proGroupId");
                record=Db.findFirst(sql);
                map.setDevicenum(record.getInt("count(*)"));
                rslist.add(map);
            }
        return new Page<BaseProjects>(rslist,page.getPageNumber(), page.getPageSize(), page.getTotalPage(), page.getTotalRow());
    }

    public List<BaseProjects> getProjectlistById(String userid){
        StaffData staffData=staffService.getStaffByName(userid);
        List<BaseProjects> projectsData=new ArrayList<>();
        if(staffData.getIRoleType()==0) {
            String[] author = staffData.getGroupAssemble().split("@");
            for (int i = 0; i < author.length; i++) {
                BaseProjects projectsData1 = getProjectById(author[i]);
                projectsData.add(projectsData1);
            }
        }
        else{
            String comid = staffData.getAgentNumber();
            projectsData = getProjectsByComId(comid);
        }
        return projectsData;
    }

    @Override
    public Page<ProjectPage> getProjectPageByNum(String agentnum,int pageno,int limit) {
        List<ProjectPage> list=new ArrayList<>();
        String sql=" from projects_data where agentNumber='"+agentnum+"'";
        Page<Record> page=Db.paginate(pageno,limit,"select * ",sql);
        List<Record> record= page.getList();
        for(Record item:record){
            ProjectPage baseProjects=new ProjectPage();
            baseProjects.setProjectid(item.getStr("proGroupId"));
            baseProjects.setCreatetime(item.getStr("createTime"));
            baseProjects.setProjectname(item.getStr("proGroupName"));
            sql="select count(*) from agent_data a left join machine_data b on a.machineSerial=b.machineSerial LEFT JOIN agent_table c on a.agentNumber=c.agentNumber where a.proGroupId='"+item.getStr("proGroupId")+"'";
            Record  record1=Db.findFirst(sql);
            baseProjects.setDevicenum(record1.getInt("count(*)"));
            list.add(baseProjects);
        }
        return new Page<ProjectPage>(list,page.getPageNumber(), page.getPageSize(), page.getTotalPage(), page.getTotalRow());
    }

    @Override
    public Page<ProjectPage> getProjectPageById(String userid, int pageno, int limit) {
        List<ProjectPage> list=new ArrayList<>();
        StaffData staffData=StaffService.me.getStaffById(userid);
        String[] projects=staffData.getGroupAssemble().split("@");

        String sql=" from projects_data where proGroupId='"+userid+"'";
        Page<Record> page=Db.paginate(pageno,limit,"select * ",sql);
        List<Record> record= page.getList();
        for(Record item:record){
            ProjectPage baseProjects=new ProjectPage();
            baseProjects.setProjectid(item.getStr("proGroupId"));
            baseProjects.setCreatetime(item.getStr("createTime"));
            baseProjects.setProjectname(item.getStr("proGroupName"));
            sql="select count(*) from agent_data a left join machine_data b on a.machineSerial=b.machineSerial LEFT JOIN agent_table c on a.agentNumber=c.agentNumber where a.proGroupId='"+item.getStr("proGroupId")+"'";
            Record  record1=Db.findFirst(sql);
            baseProjects.setDevicenum(record1.getInt("count(*)"));
            list.add(baseProjects);
        }
        return new Page<ProjectPage>(list,page.getPageNumber(), page.getPageSize(), page.getTotalPage(), page.getTotalRow());
    }

    @Override
    public Page<ProjectPage> searchProjectPageByNum(String content,String agentnum, int pageno, int limit) {
        List<ProjectPage> list=new ArrayList<>();
        String sql="";
        if(content.equals("")){
            sql=" from projects_data where agentNumber='"+agentnum+"'";
        }else{
            sql=" from projects_data where agentNumber='"+agentnum+"' and proGroupName like '%"+content+"%'";
        }
        Page<Record> page=Db.paginate(pageno,limit,"select * ",sql);
        List<Record> record= page.getList();
        for(Record item:record){
            ProjectPage baseProjects=new ProjectPage();
            baseProjects.setProjectid(item.getStr("proGroupId"));
            baseProjects.setCreatetime(item.getStr("createTime"));
            baseProjects.setProjectname(item.getStr("proGroupName"));
            sql="select count(*) from agent_data a left join machine_data b on a.machineSerial=b.machineSerial LEFT JOIN agent_table c on a.agentNumber=c.agentNumber where a.proGroupId='"+item.getStr("proGroupId")+"'";
            Record  record1=Db.findFirst(sql);
            baseProjects.setDevicenum(record1.getInt("count(*)"));
            list.add(baseProjects);
        }
        return new Page<ProjectPage>(list,page.getPageNumber(), page.getPageSize(), page.getTotalPage(), page.getTotalRow());
    }
}
