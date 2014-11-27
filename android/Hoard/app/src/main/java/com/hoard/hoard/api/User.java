package com.hoard.hoard.api;

import com.google.api.client.util.Key;

/**
 * Created by AndreSilva on 11/11/14
 */
public class User {

    @Key
    Integer id;

    @Key
    String email;

    @Key
    String permissions;

    public Integer getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getPermissions() {
        return permissions;
    }
}
