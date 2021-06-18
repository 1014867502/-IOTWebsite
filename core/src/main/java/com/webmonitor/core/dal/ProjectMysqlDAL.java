package com.webmonitor.core.dal;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.webmonitor.core.bll.StaffService;
import com.webmonitor.core.idal.IProject;

import com.webmonitor.core.model.ProjectsData;
import com.webmonitor.core.model.userbase.BaseProjects;

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
            baseProjects.setCreatetime(item.getDate("createTime"));
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
                " and a.ProGroupId='"+projectid+"'";
        Record record= Db.findFirst(sql);
        BaseProjects baseProjects=new BaseProjects();
        baseProjects.setId(record.getStr("id"));
        baseProjects.setCreatetime(record.getDate("createTime"));
        baseProjects.setAgentname(record.getStr("agentName"));
        baseProjects.setProjectid(record.getStr("proGroupId"));
        baseProjects.setProgroupname(record.getStr("proGroupName"));
        sql="select count(*) from agent_data where proGroupId="+projectid;
        record=Db.findFirst(sql);
        baseProjects.setDevicenum(record.getInt("count(*)"));
        return baseProjects;
    }

    @Override/**根据企业编号进行查询**/
    public List<BaseProjects> getProjectsByComId(String id) {
        List<BaseProjects> list=new ArrayList<>();
        String sql="select a.*, b.agentName from projects_data a ,agent_table b where a.agentNumber=b.agentNumber where"
                +" agentNumber='"+id+"'";
        List<Record> record= Db.find(sql);
        for(Record item:record){
            BaseProjects baseProjects=new BaseProjects();
            baseProjects.setId(item.getStr("id"));
            baseProjects.setCreatetime(item.getDate("createTime"));
            baseProjects.setAgentname(item.getStr("agentName"));
            baseProjects.setProjectid(item.getStr("proGroupId"));
            baseProjects.setProgroupname(item.getStr("proGroupName"));
            sql="select count(*) from agent_data a, where proGroupId="+item.getStr("proGroupName");
            Record  record1=Db.findFirst(sql);
            baseProjects.setDevicenum(record1.getInt("count(*)"));
            list.add(baseProjects);
        }
        return list;
    }

    @Override
    public Page<Object> getProjectsPageData(int pageno, int limit) {
        List<BaseProjects> list=new ArrayList<>();
        String sql=" from projects_data a ,agent_table b where a.agentNumber=b.agentNumber";
        List<Record> record= Db.find(sql);
        Page<Record> page=Db.paginate(pageno,limit,"select a.*, b.agentName ",sql);
        for(Record item:record){
            BaseProjects baseProjects=new BaseProjects();
            baseProjects.setId(item.getStr("id"));
            baseProjects.setCreatetime(item.getDate("createTime"));
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
    public Page<Object> getProjectsByComIdPageData(String comid, int pageno, int limit) {
        List<BaseProjects> list=new ArrayList<>();
        String sql=" from projects_data a ,agent_table b where a.agentNumber=b.agentNumber where"
                +" agentNumber='"+comid+"'";
        List<Record> record= Db.find(sql);
        Page<Record> page=Db.paginate(pageno,limit,"select  a.*, b.agentName ",sql);
        for(Record item:record){
            BaseProjects baseProjects=new BaseProjects();
            baseProjects.setId(item.getStr("id"));
            baseProjects.setCreatetime(item.getDate("createTime"));
            baseProjects.setAgentname(item.getStr("agentName"));
            baseProjects.setProjectid(item.getStr("proGroupId"));
            baseProjects.setProgroupname(item.getStr("proGroupName"));
            sql="select count(*) from agent_data a, where proGroupId="+item.getStr("proGroupName");
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
            case "compangy":
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
    public void addProject(String userid,String comid, String projectname) {

        ProjectsData projectsData=ProjectsData.dao.findFirst("SELECT * FROM projects_data  ORDER BY Id DESC limit 0,1");
        int id=projectsData.getProGroupId()+1;
        String sid=String.valueOf(id);
        Date date=new Date();
        DateFormat format=new SimpleDateFormat("yyyy-MM-dd");
        String time=format.format(date);
        Record group=new Record().set("proGroupId",id).set("proGroupName",projectname)
                .set("agentNumber",comid).set("createTime",time);
        Db.save("projects_data",group);
        staffService.updateauthor(userid,sid);
    }


    @Override
    public void deleteProject(String Projectid) {
        Record group=new Record().set("proGroupId",Projectid);
        Db.delete("projects_data",group);
        Db.delete("delete from agent_data where proGroupId="+Projectid);
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
        Record count=Db.findFirst("select count(*) from projects_data a,agent_data b where a.proGroupId=b.proGroupId and a.proGroupId="+projectid);
        int sum=count.getInt("count(*)");
        return sum;
    }

    /**获取项目里在线设备的数目**/
    @Override
    public int getProDevOnCountById(String projectid) {
        Record count=Db.findFirst("select count(*) from projects_data a,agent_data b where a.proGroupId=b.proGroupId and b.state=1 and a.proGroupId="+projectid);
        int sum=count.getInt("count(*)");
        return sum;
    }

    /**获取项目里离线设备的数目**/
    @Override
    public int getProDevOutCountById(String projectid) {
        Record count=Db.findFirst("select count(*) from projects_data a,agent_data b where a.proGroupId=b.proGroupId and b.state=0 and a.proGroupId="+projectid);
        int sum=count.getInt("count(*)");
        return sum;
    }
}
