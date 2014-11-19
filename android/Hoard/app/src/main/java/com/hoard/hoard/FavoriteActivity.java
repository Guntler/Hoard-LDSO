package com.hoard.hoard;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.GridView;
import android.widget.Toast;

/**
 * Created by AndreSilva on 19/11/14
 */
public class FavoriteActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.favorite_layout);

        GridView gridView = (GridView)findViewById(R.id.favorite_grid);
        gridView.setAdapter(new ProductAdapter(this));
        gridView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view,
                                    int position, long id) {
                Toast.makeText(FavoriteActivity.this, "You Clicked at " + position, Toast.LENGTH_SHORT).show();
            }
        });
    }
}
