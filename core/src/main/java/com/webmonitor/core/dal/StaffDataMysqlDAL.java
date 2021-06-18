package com.webmonitor.core.dal;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;
import com.webmonitor.core.idal.IStaffData;
import com.webmonitor.core.model.StaffData;

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
    public void edit(String comid, String loginaccount,String realname, String dept, String roletype, String accounttype, String groupassemble) {
        Record staff= Db.findFirst("select * from staff_data where uAccountNum='"+loginaccount+"'");
        staff.set("uRealName",realname).set("agentNumber",comid).set("cDept",dept).
                set("iRoleType",roletype).set("iAccountType",accounttype).set("groupAssemble",groupassemble);
        Db.update("staff_data",staff);
    }

    @Override
    public void add(String comid, String password, String realname, String dept, String roletype, String accounttype, String groupassemble) {
        String account="";
        if(isExistTable(randomAcount(),"staff_data","uAccountNum")){
            add(comid, password, realname, dept, roletype, accounttype, groupassemble);
        }else{
            Record staff=new Record().set("agentNumber",comid).set("uAccountNum",account).set("uPassword",password)
                    .set("uRealName",realname).set("cDept",dept).set("iRoleType",roletype).set("iAccountType",accounttype)
                    .set("groupAssemble",groupassemble);
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
}
