package com.hoard.hoard;

/**
 * Created by AndreSilva on 21/10/14
 */

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

public class ProductSlidePageFragment extends Fragment {
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        ViewGroup rootView = (ViewGroup) inflater.inflate(
                R.layout.single_product_pageviewer_item_layout, container, false);

        TextView productTextView = (TextView)rootView.findViewById(R.id.product_id);

        productTextView.setText("Product");

        return rootView;
    }
}
