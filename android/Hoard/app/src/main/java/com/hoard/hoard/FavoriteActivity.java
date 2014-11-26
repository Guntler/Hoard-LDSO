package com.hoard.hoard;

import android.app.Activity;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.GridView;
import android.widget.Toast;

import com.hoard.hoard.api.Favorites;
import com.hoard.hoard.api.HoardAPI;
import com.hoard.hoard.api.Product;

/**
 * Created by AndreSilva on 19/11/14
 */
public class FavoriteActivity extends Activity {

    /*
     * Hoard Api
     */
    HoardAPI hoardAPI;

    /*
     * Favorites
     */

    Favorites favorites;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.favorite_layout);

        hoardAPI = new HoardAPI(this);

        GridView gridView = (GridView)findViewById(R.id.favorite_grid);
        gridView.setAdapter(new ProductAdapter(this));
        gridView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view,
                                    int position, long id) {
                Toast.makeText(FavoriteActivity.this, "You Clicked at " + position, Toast.LENGTH_SHORT).show();
            }
        });

        new FavoritesAsyncTask().execute();
    }

    class FavoritesAsyncTask extends AsyncTask<String, String, String> {

        @Override
        protected String doInBackground(String... strings) {
            try {
                favorites = hoardAPI.getFavorites();

                for(Product prod : favorites.getResult()) {
                    Log.d("Product: ", prod.getName() + " link - " + prod.getLink());
                }

            } catch (Exception e) {
                String errorMessage = (e.getMessage()==null)?"Message is empty":e.getMessage();
                Log.e("FavoriteActivity>FavoritesAsyncTask>doInBackground>Exception:", errorMessage);
            }

            return null;
        }
    }
}
