package com.hoard.hoard.api;

import com.google.api.client.util.Key;

/**
 * Created by AndreSilva on 10/12/14
 */

public class BasicReturnParser {

    @Key
    Boolean result;

    @Key
    Boolean success;

    @Key
    String message;

    public boolean getResult() {
        return result;
    }

    public boolean getSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }
}
