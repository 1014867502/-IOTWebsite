package com.webmonitor.core.util;
import java.sql.Connection;
import java.sql.DriverManager;

public class SqlliteDataSource {
    private Connection conn;
    private String dbFile;

    /**
     *
     */
    public SqlliteDataSource() {

    }

    /**
     * 打开数据源连接
     * @throws Exception
     */
    public synchronized void open() throws Exception{
        if (this.dbFile == null){
            throw new IllegalArgumentException("dbFile cannot be null, please set it.");
        }

        Class.forName("org.sqlite.JDBC");
        this.conn =
                DriverManager.getConnection("jdbc:sqlite:" + dbFile);
    }

    /**
     * 关闭数据源连接
     * @throws Exception
     */
    public synchronized void close() throws Exception{
        if (this.conn != null){
            this.conn.close();
            this.conn = null;
        }
    }

    /**
     * 判断是否已连接数据库
     * @return
     */
    public synchronized boolean isConnected(){
        return this.conn != null;
    }

    /**
     * 数据库文件
     * @return
     */
    public String getDbFile() {
        return dbFile;
    }

    /**
     * 设置数据库文件
     * @param dbFile
     */
    public void setDbFile(String dbFile) {
        this.dbFile = dbFile;
    }

    /**
     * 获取数据库连接
     * @return
     */
    public Connection getConnection(){
        return this.conn;
    }

}
