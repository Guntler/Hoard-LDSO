package com.hoard.hoard;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by AndreSilva on 19/11/14
 */

public class ProductAdapter extends BaseAdapter {

    /*
     * Products List
     */
    private List<Product> items = new ArrayList<Product>();

    /*
     * Layout Inflater
     */
    private LayoutInflater inflater;

    public ProductAdapter(Context context) {
        inflater = LayoutInflater.from(context);

        items.add(new Product("Product_1",       R.drawable.product2));
        items.add(new Product("Product_2",   R.drawable.product2));
        items.add(new Product("Product_3", R.drawable.product2));
        items.add(new Product("Product_4",      R.drawable.product2));
        items.add(new Product("Product_5",     R.drawable.product2));
        items.add(new Product("Product_6",      R.drawable.product2));
    }

    @Override
    public int getCount() {
        return items.size();
    }

    @Override
    public Object getItem(int i) {
        return items.get(i);
    }

    @Override
    public long getItemId(int i) {
        return items.get(i).drawableId;
    }

    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {
        View v = view;
        ImageView picture;
        TextView name;

        if(v == null) {
            v = inflater.inflate(R.layout.favorite_item_layout, viewGroup, false);
            v.setTag(R.id.grid_item_image, v.findViewById(R.id.grid_item_image));
            v.setTag(R.id.grid_item_text, v.findViewById(R.id.grid_item_text));
        }

        picture = (ImageView)v.getTag(R.id.grid_item_image);
        name = (TextView)v.getTag(R.id.grid_item_text);

        Product item = (Product)getItem(i);

        picture.setImageResource(item.drawableId);
        name.setText(item.productName);

        return v;
    }

    private class Product {
        final String productName;
        final int drawableId;

        Product(String productName, int drawableId) {
            this.productName = productName;
            this.drawableId = drawableId;
        }
    }
}