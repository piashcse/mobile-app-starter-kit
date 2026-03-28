import 'dart:convert';
import 'package:dio/dio.dart';
import 'mock_data.dart';

/// Intercepts all API requests and returns mock data
/// Remove this interceptor and point to real API when ready
class MockInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 800));

    final path = options.path;
    final method = options.method;

    dynamic responseData;
    int statusCode = 200;

    // Route matching
    if (path == '/auth/login' && method == 'POST') {
      final data = options.data as Map<String, dynamic>?;
      if (data?['email'] == 'test@example.com' && data?['password'] == 'password') {
        responseData = MockData.loginSuccess;
      } else {
        statusCode = 401;
        responseData = MockData.loginError;
      }
    } else if (path == '/auth/register' && method == 'POST') {
      responseData = MockData.registerSuccess;
    } else if (path == '/auth/forgot-password' && method == 'POST') {
      responseData = MockData.forgotPasswordSuccess;
    } else if (path == '/user/profile' && method == 'GET') {
      responseData = MockData.userProfile;
    } else if (path == '/user/profile' && method == 'PUT') {
      responseData = MockData.updateProfileSuccess;
    } else if (path == '/faq' && method == 'GET') {
      responseData = MockData.faqItems;
    } else if (path == '/notifications' && method == 'GET') {
      responseData = MockData.notifications;
    } else if (path == '/auth/change-password' && method == 'POST') {
      responseData = {'message': 'Password changed successfully'};
    } else {
      statusCode = 404;
      responseData = {'message': 'Not found'};
    }

    handler.resolve(
      Response(
        requestOptions: options,
        data: responseData,
        statusCode: statusCode,
      ),
    );
  }
}
