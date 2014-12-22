'use strict';
 
describe('Welcome Page Tests', function(){
 
    //mock Application to allow us to inject our own dependencies
    beforeEach(angular.mock.module('hoard'));
	
	// start at root before every test is run
	beforeEach(function() {
		browser().navigateTo('/');
	});
	
	it('ensures user can log in', function() {
		expect(browser().location().path()).toBe("/");

		element('#hoard-signin').click();
		input('email').enter('a1@a.com');
		input('password').enter('a1');
		element('#signin-submit').click();

		// logged in route
		expect(browser().location().path()).toBe("/home/products/1");
	});
});