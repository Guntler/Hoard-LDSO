package com.hoard.hoard.api;

import com.google.api.client.util.Key;

import java.util.ArrayList;

/**
 * Created by AndreSilva on 26/11/14
 */
public class ReturnParser {

    @Key
    ArrayList<String> message;

    @Key
    User user;

    @Key
    Boolean success;

    public String getMessage() {
        return message.get(0);
    }

    public Boolean getSuccess() { return success; }

    public User getUser() { return user; }

    public String toString() {
        if(user != null)
            return user.getId() + " " + user.getEmail() + " " + user.getPermissions();
        return message.get(0);
    }
}
