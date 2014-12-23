'use strict';
 
describe('Frontpage Page Tests', function(){
 
    //mock Application to allow us to inject our own dependencies
    //beforeEach(angular.mock.module('hoard'));
	
	// start at root before every test is run
	beforeEach(function() {
		browser().navigateTo('/');
	});
	
	it('ensures users can log out', function() {
		expect(browser().location().path()).toBe("/");

		element('#hoard-signin').click();
		input('email').enter('a1@a.com');
		input('password').enter('a1');
		element('#signin-submit').click();

		// logged in route
		expect(browser().location().path()).toBe("/home/products/1");
		
		element('#options-dropdown').click();
		element('#signout-button').click();
		
		expect(browser().location().path()).toBe("/");
	});
	
	it("ensures managers don't see users and edits tabs", function() {
		expect(browser().location().path()).toBe("/");

		element('#hoard-signin').click();
		input('email').enter('m1@m.com');
		input('password').enter('m1');
		element('#signin-submit').click();

		// logged in route
		expect(browser().location().path()).toBe("/home/products/1");
		
		expect(element("#users-tab").attr('class')).toContain('ng-hide');
		expect(element("#edits-tab").attr('class')).toContain('ng-hide');
		expect(element("#products-tab").attr('class')).not().toContain('ng-hide');
	});
	
	it("ensures admins see every tab", function() {
		expect(browser().location().path()).toBe("/");

		element('#hoard-signin').click();
		input('email').enter('a1@a.com');
		input('password').enter('a1');
		element('#signin-submit').click();

		// logged in route
		expect(browser().location().path()).toBe("/home/products/1");
		
		expect(element("#users-tab").attr('class')).not().toContain('ng-hide');
		expect(element("#edits-tab").attr('class')).not().toContain('ng-hide');
		expect(element("#products-tab").attr('class')).not().toContain('ng-hide');
	});
});