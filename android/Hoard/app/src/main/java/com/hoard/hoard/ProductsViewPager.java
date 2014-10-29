package com.hoard.hoard;

import android.content.Context;
import android.support.v4.view.ViewPager;
import android.util.AttributeSet;
import android.view.GestureDetector;
import android.view.MotionEvent;

/**
 * Created by AndreSilva on 29/10/14
 */
public class ProductsViewPager extends ViewPager {

        private GestureDetector gestureDetector;

        public ProductsViewPager(Context context) {
            super(context);
        }

        public ProductsViewPager(Context context, AttributeSet attrs) {
            super(context, attrs);
        }

        public void setGestureDetector(GestureDetector gestureDetector) {
            this.gestureDetector = gestureDetector;
        }

        @Override
        public boolean onTouchEvent(MotionEvent motionEvent) {
            if (this.gestureDetector != null)
                this.gestureDetector.onTouchEvent(motionEvent);
            return super.onTouchEvent(motionEvent);
        }
}
