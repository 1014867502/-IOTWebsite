package com.webmonitor.core.model.userbase;
/**模板类**/
public class Templates {
    private int id;
    private String agentNumber;
    private String agentName;
    private int type;
    private String templateName;
    private String uAccountNum;
    private String templateOrder;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getAgentNumber() {
        return agentNumber;
    }

    public void setAgentNumber(String agentNumber) {
        this.agentNumber = agentNumber;
    }

    public String getAgentName() {
        return agentName;
    }

    public void setAgentName(String agentName) {
        this.agentName = agentName;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public String getTemplateName() {
        return templateName;
    }

    public void setTemplateName(String templateName) {
        this.templateName = templateName;
    }

    public String getuAccountNum() {
        return uAccountNum;
    }

    public void setuAccountNum(String uAccountNum) {
        this.uAccountNum = uAccountNum;
    }

    public String getTemplateOrder() {
        return templateOrder;
    }

    public void setTemplateOrder(String templateOrder) {
        this.templateOrder = templateOrder;
    }

}
