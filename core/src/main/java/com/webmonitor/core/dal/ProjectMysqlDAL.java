package com.webmonitor.core.dal;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.webmonitor.core.idal.IProject;
import com.webmonitor.core.model.GroupsData;
import com.webmonitor.core.model.userbase.BaseProjects;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ProjectMysqlDAL implements IProject {


    @Override
    /**获取所有**/
    public List<BaseProjects> getAllProjects() {
        List<BaseProjects> list=new ArrayList<>();
        String sql="select a.*, b.agentName from groups_data a ,agent_table b where a.agentNumber=b.agentNumber";
        List<Record> record= Db.find(sql);
        for(Record item:record){
            BaseProjects baseProjects=new BaseProjects();
            baseProjects.setId(item.getStr("id"));
            baseProjects.setCreatetime(item.getDate("createTime"));
            baseProjects.setAgentname(item.getStr("agentName"));
            baseProjects.setProgroupid(item.getStr("proGroupId"));
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
        String sql="select a.*, b.agentName from groups_data a ,agent_table b where a.agentNumber=b.agentNumber" +
                " and a.ProGroupId='"+projectid+"'";
        Record record= Db.findFirst(sql);
        BaseProjects baseProjects=new BaseProjects();
        baseProjects.setId(record.getStr("id"));
        baseProjects.setCreatetime(record.getDate("createTime"));
        baseProjects.setAgentname(record.getStr("agentName"));
        baseProjects.setProgroupid(record.getStr("proGroupId"));
        baseProjects.setProgroupname(record.getStr("proGroupName"));
        sql="select count(*) from agent_data where proGroupId="+projectid;
        record=Db.findFirst(sql);
        baseProjects.setDevicenum(record.getInt("count(*)"));
        return baseProjects;
    }

    @Override/**根据企业编号进行查询**/
    public List<BaseProjects> getProjectsByComId(String id) {
        List<BaseProjects> list=new ArrayList<>();
        String sql="select a.*, b.agentName from groups_data a ,agent_table b where a.agentNumber=b.agentNumber where"
                +" agentNumber='"+id+"'";
        List<Record> record= Db.find(sql);
        for(Record item:record){
            BaseProjects baseProjects=new BaseProjects();
            baseProjects.setId(item.getStr("id"));
            baseProjects.setCreatetime(item.getDate("createTime"));
            baseProjects.setAgentname(item.getStr("agentName"));
            baseProjects.setProgroupid(item.getStr("proGroupId"));
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
        String sql=" from groups_data a ,agent_table b where a.agentNumber=b.agentNumber";
        List<Record> record= Db.find(sql);
        Page<Record> page=Db.paginate(pageno,limit,"select a.*, b.agentName ",sql);
        for(Record item:record){
            BaseProjects baseProjects=new BaseProjects();
            baseProjects.setId(item.getStr("id"));
            baseProjects.setCreatetime(item.getDate("createTime"));
            baseProjects.setAgentname(item.getStr("agentName"));
            baseProjects.setProgroupid(item.getStr("proGroupId"));
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
        String sql=" from groups_data a ,agent_table b where a.agentNumber=b.agentNumber where"
                +" agentNumber='"+comid+"'";
        List<Record> record= Db.find(sql);
        Page<Record> page=Db.paginate(pageno,limit,"select  a.*, b.agentName ",sql);
        for(Record item:record){
            BaseProjects baseProjects=new BaseProjects();
            baseProjects.setId(item.getStr("id"));
            baseProjects.setCreatetime(item.getDate("createTime"));
            baseProjects.setAgentname(item.getStr("agentName"));
            baseProjects.setProgroupid(item.getStr("proGroupId"));
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
                sql="select count(*) from groups_data where agentNumber="+comid;
                break;
            case "admin":
                sql="select count(*) from groups_data";
                break;
        }
        record=Db.findFirst(sql);
        count=record.getInt("count(*)");
        return count;
    }
}
