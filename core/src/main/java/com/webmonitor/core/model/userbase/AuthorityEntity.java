package com.webmonitor.core.model.userbase;

import java.util.List;

/**权限实体类**/
public class AuthorityEntity {
    private List<FuncAuthor> appauthority;//用户权限
    private List<FuncAuthor> webauthority;
    private List<FuncAuthor> comwebauthor;//公司权限
    private List<FuncAuthor> comappauthor;
    private int writeright;

    public int getWriteright() {
        return writeright;
    }

    public void setWriteright(int writeright) {
        this.writeright = writeright;
    }

    public List<FuncAuthor> getAppauthority() {
        return appauthority;
    }

    public void setAppauthority(List<FuncAuthor> appauthority) {
        this.appauthority = appauthority;
    }

    public List<FuncAuthor> getWebauthority() {
        return webauthority;
    }

    public void setWebauthority(List<FuncAuthor> webauthority) {
        this.webauthority = webauthority;
    }

    public List<FuncAuthor> getComwebauthor() {
        return comwebauthor;
    }

    public void setComwebauthor(List<FuncAuthor> comwebauthor) {
        this.comwebauthor = comwebauthor;
    }

    public List<FuncAuthor> getComappauthor() {
        return comappauthor;
    }

    public void setComappauthor(List<FuncAuthor> comappauthor) {
        this.comappauthor = comappauthor;
    }
}
