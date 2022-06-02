<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CommonController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LibraryController;
use App\Http\Controllers\CommunicationController;
use App\Http\Controllers\ProgramController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
 
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

// testing
// Route::post('/uploadVideo', [LibraryController::class, 'uploadVideo']);

// common
Route::post('/deleteEquipmentNeeds', [CommonController::class, 'deleteEquipmentNeeds']);
Route::post('/updateEquipmentNeeds', [CommonController::class, 'updateEquipmentNeeds']);
Route::post('/deleteSlide', [CommonController::class, 'deleteSlide']);
Route::post('/getDashboardData', [CommonController::class, 'getDashboardData']);
Route::get('/getFilters', [CommonController::class, 'getFilters']);
Route::get('/getAges', [CommonController::class, 'getAges']);
Route::get('/getGoals', [CommonController::class, 'getGoals']);
Route::get('/getSlides', [CommonController::class, 'getSlides']);
Route::post('/addSlide', [CommonController::class, 'addSlide']);
Route::post('/addEquipmentNeeds', [CommonController::class, 'addEquipmentNeeds']);
Route::get('/getEquipmentNeeds', [CommonController::class, 'getEquipmentNeeds']);
Route::get('/getFileUrls', [CommonController::class, 'getFileUrls']);

// users
Route::post('/deleteUser', [UsersController::class, 'deleteUser']);
Route::post('/updateStatus', [UsersController::class, 'updateStatus']);
Route::post('/updateFreeStatus', [UsersController::class, 'updateFreeStatus']);
Route::post('/searchUsers', [UsersController::class, 'searchUsers']);
Route::post('/getUsers', [UsersController::class, 'getUsers']);
Route::post('/updateAdmin', [UsersController::class, 'updateAdmin']);
Route::post('/sendEmail', [UsersController::class, 'sendEmail']);
Route::post('/registerUser', [UsersController::class, 'registerUser']);
Route::post('/forgotPassword', [UsersController::class, 'forgotPassword']);
Route::post('/resetPassword', [UsersController::class, 'resetPassword']);
Route::post('/updateProfile', [UsersController::class, 'updateProfile']);
Route::post('/changePassword', [UsersController::class, 'changePassword']);
Route::post('/updatePushToken', [UsersController::class, 'updatePushToken']);
Route::post('/updateSubscribeStatus', [UsersController::class, 'updateSubscribeStatus']);

// library
Route::post('/deleteCategoryVideo', [LibraryController::class, 'deleteCategoryVideo']);
Route::post('/updateCategory', [LibraryController::class, 'updateCategory']);
Route::post('/deleteCategory', [LibraryController::class, 'deleteCategory']);
Route::get('/getCategories', [LibraryController::class, 'getCategories']);
Route::post('/addCategory', [LibraryController::class, 'addCategory']);
Route::post('/getCategoryVideos', [LibraryController::class, 'getCategoryVideos']);
Route::post('/addCategoryVideo', [LibraryController::class, 'addCategoryVideo']);
Route::post('/searchVideos', [LibraryController::class, 'searchVideos']);
Route::post('/addRemoveFavoriteVideo', [LibraryController::class, 'addRemoveFavoriteVideo']);
Route::post('/getFavoriteVideos', [LibraryController::class, 'getFavoriteVideos']);
Route::post('/addWorkUpTo', [LibraryController::class, 'addWorkUpTo']);
Route::post('/deleteWorkUpTo', [LibraryController::class, 'deleteWorkUpTo']);
Route::post('/getWorkUpToList', [LibraryController::class, 'getWorkUpToList']);

// communication
Route::post('/sendNotification', [CommunicationController::class, 'sendNotification']);
Route::post('/sendEmail', [CommunicationController::class, 'sendEmail']);
Route::post('/updateChatStatus', [CommunicationController::class, 'updateChatStatus']);
Route::post('/getAllChats', [CommunicationController::class, 'getAllChats']);
Route::post('/getChat', [CommunicationController::class, 'getChat']);
Route::post('/getUnreadChatCount', [CommunicationController::class, 'getUnreadChatCount']);
Route::post('/sendMessage', [CommunicationController::class, 'sendMessage']);
Route::post('/getNotifications', [CommunicationController::class, 'getNotifications']);
Route::post('/getUnreadNotificationCount', [CommunicationController::class, 'getUnreadNotificationCount']);
Route::post('/clearNotifications', [CommunicationController::class, 'clearNotifications']);

// programs
Route::post('/removeMembers', [ProgramController::class, 'removeMembers']);
Route::post('/addMembers', [ProgramController::class, 'addMembers']);
Route::post('/getSpecialProgramMembers', [ProgramController::class, 'getSpecialProgramMembers']);
Route::post('/updateSpecialProgram', [ProgramController::class, 'updateSpecialProgram']);
Route::post('/deleteSpecialProgram', [ProgramController::class, 'deleteSpecialProgram']);
Route::post('/getAllSpecialPrograms', [ProgramController::class, 'getAllSpecialPrograms']);
Route::post('/getJoinedPrograms', [ProgramController::class, 'getJoinedPrograms']);
Route::post('/getProgramExercises', [ProgramController::class, 'getProgramExercises']);
Route::post('/addProgram', [ProgramController::class, 'addProgram']);
Route::post('/addWeeklyProgram', [ProgramController::class, 'addWeeklyProgram']);
Route::post('/updateProgram', [ProgramController::class, 'updateProgram']);
Route::post('/updateWeeklyProgram', [ProgramController::class, 'updateWeeklyProgram']);
Route::post('/deleteProgram', [ProgramController::class, 'deleteProgram']);
Route::post('/joinFriendProgram', [ProgramController::class, 'joinFriendProgram']);
Route::post('/getProgramDetails', [ProgramController::class, 'getProgramDetails']);
Route::post('/addSpecialProgram', [ProgramController::class, 'addSpecialProgram']);
Route::post('/getSpecialPrograms', [ProgramController::class, 'getSpecialPrograms']);
Route::post('/getJoinedSpecialPrograms', [ProgramController::class, 'getJoinedSpecialPrograms']);
Route::post('/joinSpecialProgram', [ProgramController::class, 'joinSpecialProgram']);
Route::post('/getSpecialProgramDetails', [ProgramController::class, 'getSpecialProgramDetails']);

Route::post('isAdminOnline', [AuthController::class, 'isAdminOnline']);
Route::post('logoutUser', [AuthController::class, 'logoutUser']);
Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('loginUser', [AuthController::class, 'loginUser']);
    Route::post('socialLogin', [AuthController::class, 'socialLogin']);
    // Route::post('logout', 'AuthController@logout');
    // Route::post('refresh', 'AuthController@refresh');
    // Route::post('me', 'AuthController@me');
});