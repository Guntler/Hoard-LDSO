package com.hoard.hoard.api;

import com.google.api.client.util.Key;

import java.util.ArrayList;

/**
 * Created by AndreSilva on 26/11/14
 */

public class Products {

    @Key
    ArrayList<Product> result;

    @Key
    boolean success;

    public ArrayList<Product> getResult() {
        return result;
    }

    public boolean getSuccess() {return success; }
}
