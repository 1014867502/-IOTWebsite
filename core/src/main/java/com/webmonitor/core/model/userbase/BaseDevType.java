package com.webmonitor.core.model.userbase;

import java.io.Serializable;

public class BaseDevType implements Serializable {
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    String name;
    int count;
}
