package com.hoard.hoard.api;

import com.google.api.client.util.Key;

/**
 * Created by AndreSilva on 26/11/14
 */
public class ReturnParser {

    @Key
    String error;
/*
    @Key
    String message;

    @Key
    User user;
*/
    public String getError() {
        return error;
    }
/*
    public String getMessage() {
        return message;
    }

    public User getUser() {
        return user;
    }

    public String toString() {
        return user.getId() + " " + user.getEmail() + " " + user.getPermissions() + " " + user.getRegisterdate();
    }
*/
}
