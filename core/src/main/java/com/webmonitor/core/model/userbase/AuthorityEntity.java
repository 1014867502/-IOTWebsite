package com.webmonitor.core.model.userbase;

/**权限实体类**/
public class AuthorityEntity {
    private String appauthority;
    private String webauthority;
    private int writeright;

    public int getWriteright() {
        return writeright;
    }

    public void setWriteright(int writeright) {
        this.writeright = writeright;
    }

    public String getAppauthority() {
        return appauthority;
    }

    public void setAppauthority(String appauthority) {
        this.appauthority = appauthority;
    }

    public String getWebauthority() {
        return webauthority;
    }

    public void setWebauthority(String webauthority) {
        this.webauthority = webauthority;
    }
}
