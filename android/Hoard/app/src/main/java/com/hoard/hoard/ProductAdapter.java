package com.hoard.hoard;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.hoard.hoard.api.Product;

import java.io.InputStream;
import java.util.ArrayList;

/**
 * Created by AndreSilva on 19/11/14
 */

public class ProductAdapter extends BaseAdapter {

    /*
     * Context
     */
    private Context context;

    /*
     * Layout Inflater
     */
    private LayoutInflater inflater;

    /*
     * Products List
     */
    private ArrayList<Product> items = new ArrayList<Product>();

    public ProductAdapter(Context context, ArrayList<Product> favorites) {
        this.context = context;
        inflater = LayoutInflater.from(context);
        items = favorites;
    }

    @Override
    public int getCount() {
        return items.size();
    }

    @Override
    public Product getItem(int i) {
        return items.get(i);
    }

    @Override
    public long getItemId(int i) {
        return 0;
    }

    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {

        if(view == null) {
            view = inflater.inflate(R.layout.favorite_item_layout, viewGroup, false);
            view.setTag(R.id.grid_item_image, view.findViewById(R.id.grid_item_image));
            view.setTag(R.id.grid_item_text, view.findViewById(R.id.grid_item_text));
        }

        ImageView picture = (ImageView)view.getTag(R.id.grid_item_image);
        TextView name = (TextView)view.getTag(R.id.grid_item_text);

        Product product = (Product)getItem(i);

        DownloadImageTask task = new DownloadImageTask(picture);
        task.execute(context.getResources().getString(R.string.product_images_url)+product.getImageName());
        name.setText(product.getName());

        return view;
    }

    private class DownloadImageTask extends AsyncTask<String, Void, Bitmap> {
        ImageView bmImage;

        public DownloadImageTask(ImageView bmImage) {
            this.bmImage = bmImage;
        }

        protected Bitmap doInBackground(String... urls) {
            String urlDisplay = urls[0];
            Bitmap mIcon11 = null;
            try {
                InputStream in = new java.net.URL(urlDisplay).openStream();
                mIcon11 = BitmapFactory.decodeStream(in);
            } catch (Exception e) {
                Log.e("ProductAdapter>DownloadImageTask>doInBackground: ", e.getMessage());
                e.printStackTrace();
            }
            return mIcon11;
        }

        protected void onPostExecute(Bitmap result) {
            bmImage.setImageBitmap(result);
        }
    }
}