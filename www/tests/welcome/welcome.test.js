'use strict';
 
describe('Welcome Page Tests', function(){
 
    //mock Application to allow us to inject our own dependencies
    //beforeEach(angular.mock.module('hoard'));
	
	// start at root before every test is run
	beforeEach(function() {
		browser().navigateTo('/');
	});
	
	it('ensures admin can log in', function() {
		expect(browser().location().path()).toBe("/");

		element('#hoard-signin').click();
		input('email').enter('a1@a.com');
		input('password').enter('a1');
		element('#signin-submit').click();
		expect(browser().location().path()).toBe("/home/products/1");
		
	});
	
	it('ensures manager can log in', function() {
		expect(browser().location().path()).toBe("/");

		element('#hoard-signin').click();
		input('email').enter('m1@m.com');
		input('password').enter('m1');
		element('#signin-submit').click();

		// logged in route
		expect(browser().location().path()).toBe("/home/products/1");
	});
	
	it('ensures user cant log in', function() {
		expect(browser().location().path()).toBe("/");

		element('#hoard-signin').click();
		input('email').enter('u1@u.com');
		input('password').enter('u1');
		element('#signin-submit').click();

		expect(browser().location().path()).toBe("/");
		expect(element("#signin-form").attr('class')).toContain('error');
	});
	
	it('ensures wrong password cant log in', function() {
		expect(browser().location().path()).toBe("/");

		element('#hoard-signin').click();
		input('email').enter('m1@m1.com');
		input('password').enter('m2');
		element('#signin-submit').click();

		expect(browser().location().path()).toBe("/");
		expect(element("#signin-form").attr('class')).toContain('error');
	});
	
	it('ensures wrong email cant log in', function() {
		expect(browser().location().path()).toBe("/");

		element('#hoard-signin').click();
		input('email').enter('wrong@wrong.com');
		input('password').enter('m1');
		element('#signin-submit').click();

		expect(browser().location().path()).toBe("/");
		expect(element("#signin-form").attr('class')).toContain('error');
	});
});