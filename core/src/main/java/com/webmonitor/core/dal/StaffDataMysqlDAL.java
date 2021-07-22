package com.webmonitor.core.dal;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.webmonitor.core.idal.IStaffData;
import com.webmonitor.core.model.StaffData;
import com.webmonitor.core.model.StaffDataEntity;
import com.webmonitor.core.util.MD5Utils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

public class StaffDataMysqlDAL implements IStaffData {
    @Override
    public StaffData getStaffByName(String username) {
        StaffData staffData=StaffData.dao.findFirst("select * from staff_data where uAccountNum='"+username+"'");
        return  staffData;
    }

    @Override
    public StaffData getStaffById(String userid) {
        StaffData staffData=StaffData.dao.findById(userid);
        return  staffData;
    }
    @Override
    public void edit(StaffData staffData) {
//        Record staff= Db.findFirst("select * from staff_data where uAccountNum='"+staffData.getUAccountNum()+"'");
//        staff.set("uRealName",realname).set("agentNumber",comid).set("cDept",dept).
//                set("iRoleType",roletype).set("iAccountType",accounttype).set("groupAssemble",groupassemble);
           staffData.update();
    }

    @Override
    public void add(StaffData staffData) {
        String account="";
        if(isExistTable(randomAcount(),"staff_data","uAccountNum")){
            add(staffData);
        }else{
            String password=staffData.getUPassword();
            String code= MD5Utils.md5(password);
            Record staff=new Record().set("agentNumber",staffData.getAgentNumber()).set("uAccountNum",staffData.getUAccountNum()).set("uPassword",code)
                    .set("uRealName",staffData.getURealName()).set("cDept",staffData.getCDept()).set("iRoleType",staffData.getIRoleType()).set("iAccountType",staffData.getIAccountType())
                    .set("groupAssemble",staffData.getGroupAssemble());
            Db.save("staff_data",staff);
        }
    }

    @Override
    public void delete(String loginaccount) {
        Record staff=new Record().set("uAccountNum",loginaccount);
        Db.delete("staff_data",staff);
    }

    @Override
    public void updateAuthorityById(String userid, String project) {

        Record staff= Db.findFirst("select * from staff_data where Id='"+userid+"'");
        String author=staff.getStr("groupAssemble");
        author=author+"@"+project;
        staff.set("groupAssemble",author);
        Db.update("staff_data",staff);

    }

    @Override
    public List<StaffData> searchStaffData(String customname) {
        List<StaffData> staffDataList=new ArrayList<>();
        staffDataList=StaffData.dao.find("select * from staff_data where uAccountNum like '%"+customname+"%'");
        return staffDataList;
    }

    public String randomAcount(){
        Random random=new Random();
        StringBuffer sb=new StringBuffer();
        for(int i=0;i<11;i++){
            int number=random.nextInt(3);
            long result=0;
            switch(number){
                case 0:
                    result=Math.round(Math.random()*25+65);
                    sb.append(String.valueOf((char)result));
                    break;
                case 1:
                    result=Math.round(Math.random()*25+97);
                    sb.append(String.valueOf((char)result));
                    break;
                case 2:
                    sb.append(String.valueOf(new Random().nextInt(10)));
                    break;
            }
        }
        return sb.toString();
    }

    /**根据id判断项目是否存在**/
    public boolean isExistTable(String id,String tablename,String column){
        Record record=Db.findFirst("select * from "+tablename+" where "+column+"='"+id+"'");
        if(record!=null){
            return true;
        }else{
            return false;
        }
    }

    /**获取用户列表**/
    public List<StaffDataEntity> getAllCustomByPage(int pageno,int limit){
        String sql=" from staff_data a left join agent_table b on a.agentNumber=b.agentNumber";
        List<StaffDataEntity> list=new ArrayList<>();
        Page<Record> record= Db.paginate(pageno,limit,"select a.*,b.agentName",sql);
        List<Record> recordList=record.getList();
        for(Record item:recordList){
            StaffDataEntity staffDataEntity=new StaffDataEntity();
            staffDataEntity.setId(item.getInt("id"));
            staffDataEntity.setAgentName(item.getStr("agentName"));
            staffDataEntity.setAgentNumber(item.getStr("agentNumber"));
            staffDataEntity.setuAccountNum(item.getStr("uAccountNum"));
            staffDataEntity.setuPassword(item.getStr("uPassword"));
            staffDataEntity.setcDept(item.getStr("cDept"));
            staffDataEntity.setuRealName(item.getStr("uRealName"));
            staffDataEntity.setiRoleType(item.getInt("iRoleType"));
            String projectlist=item.getStr("groupAssemble").replace('@',',');
            staffDataEntity.setGroupAssemble(projectlist);
            int type=item.getInt("iRoleType");
            staffDataEntity.setRoleType(RoleType.getTypeName(type));
            list.add(staffDataEntity);
        }
        return list;
    }

    /**根据类别查询用户数目**/
    @Override
    public List<StaffDataEntity> getCountByType(String type) {
        String sql="select a.*,b.agentName from staff_data a left join agent_table b on a.agentNumber=b.agentNumber where iRoleType="+type;
        List<StaffDataEntity> list=new ArrayList<>();
        List<Record> record= Db.find(sql);
        for(Record item:record){
            StaffDataEntity staffDataEntity=new StaffDataEntity();
            staffDataEntity.setId(item.getInt("id"));
            staffDataEntity.setAgentName(item.getStr("agentName"));
            staffDataEntity.setAgentNumber(item.getStr("agentNumber"));
            staffDataEntity.setuAccountNum(item.getStr("uAccountNum"));
            staffDataEntity.setuPassword(item.getStr("uPassword"));
            staffDataEntity.setcDept(item.getStr("cDept"));
            staffDataEntity.setuRealName(item.getStr("uRealName"));
            staffDataEntity.setiRoleType(item.getInt("iRoleType"));
            String projectlist=item.getStr("groupAssemble").replace('@',',');
            staffDataEntity.setGroupAssemble(projectlist);
            int roletype=item.getInt("iRoleType");
            staffDataEntity.setRoleType(RoleType.getTypeName(roletype));
            list.add(staffDataEntity);
        }
        return list;
    }

    @Override
    public List<StaffDataEntity> getAlCustom() {
        String sql="select a.*,b.agentName from staff_data a left join agent_table b on a.agentNumber=b.agentNumber";
        List<StaffDataEntity> list=new ArrayList<>();
        List<Record> record= Db.find(sql);
        for(Record item:record){
            StaffDataEntity staffDataEntity=new StaffDataEntity();
            staffDataEntity.setId(item.getInt("id"));
            staffDataEntity.setAgentName(item.getStr("agentName"));
            staffDataEntity.setAgentNumber(item.getStr("agentNumber"));
            staffDataEntity.setuAccountNum(item.getStr("uAccountNum"));
            staffDataEntity.setuPassword(item.getStr("uPassword"));
            staffDataEntity.setcDept(item.getStr("cDept"));
            staffDataEntity.setuRealName(item.getStr("uRealName"));
            staffDataEntity.setiRoleType(item.getInt("iRoleType"));
            String projectlist=item.getStr("groupAssemble").replace('@',',');
            staffDataEntity.setGroupAssemble(projectlist);
            int roletype=item.getInt("iRoleType");
            staffDataEntity.setRoleType(RoleType.getTypeName(roletype));
            list.add(staffDataEntity);
        }
        return list;
    }

    @Override
    public Page<StaffDataEntity> searchCustomByParam(String content, String agentnum, String roletype, int pageno, int limit) {
        String sql=" from staff_data a left join agent_table b on a.agentNumber=b.agentNumber where a.iRoleType="+roletype;
        String test="";
        if(content!=null&&!content.isEmpty()){
            sql=sql+" and a.uAccountNum like '%"+content+"%' ";
        }else if(!agentnum.isEmpty()){
            sql=sql+" and a.agentNumber='"+agentnum+"' ";
        }
        Page<Record> page = Db.paginate(pageno, limit, "select a.*,b.agentName",sql);
        List<Record> recordList = page.getList();
        List<StaffDataEntity> rslist = new ArrayList<>();
        for (Record record : recordList) {
            StaffDataEntity staffDataEntity=new StaffDataEntity();
            staffDataEntity.setId(record.getInt("id"));
            staffDataEntity.setAgentName(record.getStr("agentName"));
            staffDataEntity.setAgentNumber(record.getStr("agentNumber"));
            staffDataEntity.setuAccountNum(record.getStr("uAccountNum"));
            staffDataEntity.setuPassword(record.getStr("uPassword"));
            staffDataEntity.setcDept(record.getStr("cDept"));
            staffDataEntity.setuRealName(record.getStr("uRealName"));
            staffDataEntity.setiRoleType(record.getInt("iRoleType"));
            String projectlist=record.getStr("groupAssemble").replace('@',',');
            staffDataEntity.setGroupAssemble(projectlist);
            int type=record.getInt("iRoleType");
            staffDataEntity.setRoleType(RoleType.getTypeName(type));
            rslist.add(staffDataEntity);
        }
        return new Page<StaffDataEntity>(rslist, page.getPageNumber(), page.getPageSize(), page.getTotalPage(), page.getTotalRow());
    }


}
