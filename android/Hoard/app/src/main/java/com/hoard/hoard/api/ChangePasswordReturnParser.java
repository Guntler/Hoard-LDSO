package com.hoard.hoard.api;

import com.google.api.client.util.Key;

/**
 * Created by AndreSilva on 29/12/14
 */

public class ChangePasswordReturnParser {

    @Key
    boolean result;

    @Key
    boolean success;

    public boolean getResult() {
        return result;
    }

    public boolean getSuccess() {
        return success;
    }
}
