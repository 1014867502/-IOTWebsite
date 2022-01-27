package com.webmonitor.core.dal;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.webmonitor.core.idal.IOrderLog;
import com.webmonitor.core.model.MachineData;
import com.webmonitor.core.model.StaffData;
import com.webmonitor.core.model.UpdateData;
import com.webmonitor.core.model.userbase.TakeNoteEntity;

import java.util.ArrayList;
import java.util.List;

public class OrderLogMysqlDAL implements IOrderLog {

    /**获取所有配置日志信息**/
    public Page<TakeNoteEntity> getAllOrderLog(int pageno,int limit){
        String sql=" from take_note a left join agent_data b on a.machineSerial=b.machineSerial LEFT JOIN agent_table c on b.agentNumber=c.agentNumber " +
                " order by a.workTime desc";
        Page<Record> page = Db.paginate(pageno, limit, "select  a.*,c.agentName ",sql);
        List<Record> recordList = page.getList();
        List<TakeNoteEntity> rslist = new ArrayList<>();
        for (Record record : recordList) {
            TakeNoteEntity map = new TakeNoteEntity();
            map.setMachineSerial(record.getStr("machineSerial"));
            Record result=Db.findFirst("select connectState from machine_data where machineSerial='"+record.getStr("machineSerial")+"'");
            if(result!=null){
                map.setType(result.getStr("connectState").equals("0")?0:1);
            }
            map.setAgentName(record.getStr("agentName"));
            if(record.getInt("ResSate")!=null){
                switch (record.getInt("ResSate")){
                    case 1:
                        map.setResSate("执行成功");
                        break;
                    case 2:
                        map.setResSate("执行中");
                        break;
                    case 3:
                        map.setResSate("执行失败");
                        break;
                }
            }
            map.setFunProperties(record.getStr("funProperties"));
            map.setWorkTime(record.getStr("workTime"));
            if(record.getInt("setFormwork")!=null){
                switch (record.getInt("setFormwork")){
                    case 1:
                        map.setSetFromwork("网络设置");
                        break;
                    case 2:
                        map.setSetFromwork("站点设置");
                        break;
                    case 3:
                        map.setSetFromwork("坐标系统");
                        break;
                    case 4:
                        map.setSetFromwork("外界传感器");
                        break;
                    case 5:
                        map.setSetFromwork("平台对接");
                        break;
                    case 6:
                        map.setSetFromwork("设备控制");
                        break;
                    case 7:
                        map.setSetFromwork("辅助功能");
                        break;
                    default:
                        map.setSetFromwork("升级设置");
                        break;
                }
            }
            rslist.add(map);
        }
        return new Page<TakeNoteEntity>(rslist, page.getPageNumber(), page.getPageSize(), page.getTotalPage(), page.getTotalRow());
    }

    /**查找配置日志信息**/
    public Page<TakeNoteEntity> searchAlllOrderLog(StaffData staffData,String company, String content, int pageno, int limit){
        String sql=" from take_note a left join agent_data b on a.machineSerial=b.machineSerial LEFT JOIN agent_table c on b.agentNumber=c.agentNumber ";
        String role=RoleType.getString(staffData.getIRoleType());
        if(!company.equals("all")){
            sql+=" where b.agentNumber='"+company+"'";
        }
        if(!content.equals("")){
            if(company.equals("all")){
                sql+=" where a.machineSerial like '%"+content+"%'";
            }else{
                sql+=" and a.machineSerial like '%"+content+"%'";
            }
        }
        if(role.equals("admin")){
            String groupagent=staffData.getGroupAgentNumber().replace("@",",");
            if(sql.contains("where")){
                sql+=" and b.agentNumber in ("+groupagent+")";
            }else{
                sql+=" where b.agentNumber in ("+groupagent+")";

            }
        }
        sql+=" order by a.workTime desc";
        Page<Record> page = Db.paginate(pageno, limit, "select  a.*,c.agentName ",sql);
        List<Record> recordList = page.getList();
        List<TakeNoteEntity> rslist = new ArrayList<>();
        for (Record record : recordList) {
            TakeNoteEntity map = new TakeNoteEntity();
            map.setMachineSerial(record.getStr("machineSerial"));
            Record result=Db.findFirst("select connectState from machine_data where machineSerial='"+record.getStr("machineSerial")+"'");
            if(result!=null){
                map.setType(result.getStr("connectState").equals("0")?0:1);
            }
            map.setAgentName(record.getStr("agentName"));
            if(record.getInt("ResSate")!=null){
                switch (record.getInt("ResSate")){
                    case 1:
                        map.setResSate("执行成功");
                        break;
                    case 2:
                        map.setResSate("执行中");
                        break;
                    case 3:
                        map.setResSate("执行失败");
                        break;
                }
            }
            map.setFunProperties(record.getStr("funProperties"));
            map.setWorkTime(record.getStr("workTime"));
            if(record.getInt("setFormwork")!=null){
                switch (record.getInt("setFormwork")){
                    case 1:
                        map.setSetFromwork("网络设置");
                        break;
                    case 2:
                        map.setSetFromwork("站点设置");
                        break;
                    case 3:
                        map.setSetFromwork("坐标系统");
                        break;
                    case 4:
                        map.setSetFromwork("外界传感器");
                        break;
                    case 5:
                        map.setSetFromwork("平台对接");
                        break;
                    case 6:
                        map.setSetFromwork("设备控制");
                        break;
                    case 7:
                        map.setSetFromwork("辅助功能");
                        break;
                    default:
                        map.setSetFromwork("升级设置");
                        break;
                }
            }
            rslist.add(map);
        }
        return new Page<TakeNoteEntity>(rslist, page.getPageNumber(), page.getPageSize(), page.getTotalPage(), page.getTotalRow());
    }

    /**获取当前设备的相关配置日志信息**/
    public Page<TakeNoteEntity> getOrderLogBySn(int pageno,int limit,String  machinesen){
        String sql=" from take_note a left join agent_data b on a.machineSerial=b.machineSerial LEFT JOIN agent_table c on b.agentNumber=c.agentNumber " +
                "where a.machineSerial like '%"+machinesen+"%' order by a.workTime desc";
        Page<Record> page = Db.paginate(pageno, limit, "select  a.*,c.agentName ",sql);
        List<Record> recordList = page.getList();
        List<TakeNoteEntity> rslist = new ArrayList<>();
        for (Record record : recordList) {
            TakeNoteEntity map = new TakeNoteEntity();
            map.setMachineSerial(record.getStr("machineSerial"));
            Record result=Db.findFirst("select connectState from machine_data where machineSerial='"+record.getStr("machineSerial")+"'");
            if(result!=null){
                map.setType(result.getStr("connectState").equals("0")?0:1);
            }
            map.setAgentName(record.getStr("agentName"));
            if(record.getInt("ResSate")!=null){
                switch (record.getInt("ResSate")){
                    case 1:
                        map.setResSate("执行成功");
                        break;
                    case 2:
                        map.setResSate("执行中");
                        break;
                    case 3:
                        map.setResSate("执行失败");
                        break;
                }
            }
            map.setFunProperties(record.getStr("funProperties"));
            map.setWorkTime(record.getStr("workTime"));
            if(record.getInt("setFormwork")!=null){
                switch (record.getInt("setFormwork")){
                    case 1:
                        map.setSetFromwork("网络设置");
                        break;
                    case 2:
                        map.setSetFromwork("站点设置");
                        break;
                    case 3:
                        map.setSetFromwork("坐标系统");
                        break;
                    case 4:
                        map.setSetFromwork("外界传感器");
                        break;
                    case 5:
                        map.setSetFromwork("平台对接");
                        break;
                    case 6:
                        map.setSetFromwork("设备控制");
                        break;
                    case 7:
                        map.setSetFromwork("辅助功能");
                        break;
                    default:
                        map.setSetFromwork("升级设置");
                        break;
                }
            }
            rslist.add(map);
        }
        return new Page<TakeNoteEntity>(rslist, page.getPageNumber(), page.getPageSize(), page.getTotalPage(), page.getTotalRow());
    }

    /**获取当前设备的相关配置日志信息**/
    public Page<TakeNoteEntity> getOrderLogByDate(int pageno,int limit,String  machinesen,String begin,String end){
        String sql=" from take_note a left join agent_data b on a.machineSerial=b.machineSerial LEFT JOIN agent_table c on b.agentNumber=c.agentNumber " +
                "where a.machineSerial like '%"+machinesen+"%' and a.workTime BETWEEN '"+begin+"' and '"+end+"' order by a.workTime desc";
        Page<Record> page = Db.paginate(pageno, limit, "select  a.*,c.agentName ",sql);
        List<Record> recordList = page.getList();
        List<TakeNoteEntity> rslist = new ArrayList<>();
        for (Record record : recordList) {
            TakeNoteEntity map = new TakeNoteEntity();
            map.setMachineSerial(record.getStr("machineSerial"));
            Record result=Db.findFirst("select connectState from machine_data where machineSerial='"+record.getStr("machineSerial")+"'");
            if(result!=null){
                map.setType(result.getStr("connectState").equals("0")?0:1);
            }
            map.setAgentName(record.getStr("agentName"));
            if(record.getInt("ResSate")!=null){
                switch (record.getInt("ResSate")){
                    case 1:
                        map.setResSate("执行成功");
                        break;
                    case 2:
                        map.setResSate("执行中");
                        break;
                    case 3:
                        map.setResSate("执行失败");
                        break;
                }
            }
            map.setFunProperties(record.getStr("funProperties"));
            map.setWorkTime(record.getStr("workTime"));
            if(record.getInt("setFormwork")!=null){
                switch (record.getInt("setFormwork")){
                    case 1:
                        map.setSetFromwork("网络设置");
                        break;
                    case 2:
                        map.setSetFromwork("站点设置");
                        break;
                    case 3:
                        map.setSetFromwork("坐标系统");
                        break;
                    case 4:
                        map.setSetFromwork("外界传感器");
                        break;
                    case 5:
                        map.setSetFromwork("平台对接");
                        break;
                    case 6:
                        map.setSetFromwork("设备控制");
                        break;
                    case 7:
                        map.setSetFromwork("辅助功能");
                        break;
                    default:
                        map.setSetFromwork("升级设置");
                        break;
                }
            }
            rslist.add(map);
        }
        return new Page<TakeNoteEntity>(rslist, page.getPageNumber(), page.getPageSize(), page.getTotalPage(), page.getTotalRow());
    }
}

