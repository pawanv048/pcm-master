<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User; 
use App\Models\JoinedProgram; 
use App\Models\Program; 
use App\Models\ProgramExercise; 
use App\Models\SpecialProgram;  
use App\Models\JoinedSpecialProgram; 
use App\Models\SpecialVideoLink;  
use App\Models\SpecialSectionLink;  
use App\Models\SpecialProgramLink;  

class ProgramController extends Controller
{

    public function getJoinedPrograms(Request $request)
    {
        $user = User::where(array('access_token' => $request->access_token))->first();
        if ($user) {
            $programs = JoinedProgram::where('user_id', $request->user_id)->select('id', 'program_id', 'added_date')->with(['program'])->get();
            return response()->json(['status' => 'success', 'data' => $programs]);
        }  
        else {
            return response()->json(['status' => 'failed', 'msg' => 'Invalid access']);
        }
    }

    public function getProgramExercises(Request $request)
    {
        $user = User::where(array('access_token' => $request->access_token))->first();
        if ($user) {
            $exercises = ProgramExercise::where('program_id', $request->program_id)->orderBy('id')->with(['video'])->get();
            // $exercises = $exercises->sortBy('id');
            return response()->json(['status' => 'success', 'data' => $exercises]);
        }  
        else {
            return response()->json(['status' => 'failed', 'msg' => 'Invalid access']);
        }
    }

    public function addProgram(Request $request)
    {
        $user = User::where(array('access_token' => $request->access_token))->first();
        if ($user) {
            // check if already added then delete and add new
            $p = Program::where(array('master_id' => $request->master_id, 'weekday' => $request->weekday))->first();
            if($p){
                // delete program exercises
                ProgramExercise::where(array('program_id' => $p->id))->delete();
                // remove program join (for all users)
                JoinedProgram::where(array('program_id' => $p->id))->delete();
                // delete program
                Program::where(array('id' => $p->id))->delete();
            }
            $program = new Program();
            $program->master_id = $request->master_id;
            $program->user_id = $request->user_id;
            $program->title = $request->title;
            $exercises = json_decode($request->exercises, true);
            $program->exercises = count($exercises);
            $program->weekday = $request->weekday;
            $program->save();
            // add program exercises
            foreach ($exercises as $exercise) {
                $programEx = new ProgramExercise();
                $programEx->program_id = $program->id;
                $programEx->title = $exercise['title'];
                $programEx->video_id = $exercise['video_id'];
                $programEx->sets = $exercise['sets'];
                $programEx->save();
            }
            // auto join my program
            $joined = new JoinedProgram();
            $joined->program_id = $program->id;
            $joined->user_id = $request->user_id;
            $joined->save();
            return response()->json(['status' => 'success', 'data' => $program]);
        }  
        else {
            return response()->json(['status' => 'failed', 'msg' => 'Invalid access']);
        }
    }
    
    public function addWeeklyProgram(Request $request)
    {
        $user = User::where(array('access_token' => $request->access_token))->first();
        if ($user) {
            $master_id = $request->master_id;
            $user_id = $request->user_id;
            $title = $request->title;
            $weekdayPrograms = json_decode($request->programs, true);
            foreach ($weekdayPrograms as $weekdayProgram) {
                // check if already added then delete and add new
                $p = Program::where(array('master_id' => $master_id, 'weekday' => $weekdayProgram['weekday']))->first();
                if($p){
                    // delete program exercises
                    ProgramExercise::where(array('program_id' => $p->id))->delete();
                    // remove program join (for all users)
                    JoinedProgram::where(array('program_id' => $p->id))->delete();
                    // delete program
                    Program::where(array('id' => $p->id))->delete();
                }
                $program = new Program();
                $program->master_id = $master_id;
                $program->user_id = $user_id;
                $program->title = $title;
                $exercises = $weekdayProgram['exercises'];
                $program->exercises = count($exercises);
                $program->weekday = $weekdayProgram['weekday'];
                $program->save();
                // add program exercises
                foreach ($exercises as $exercise) {
                    $programEx = new ProgramExercise();
                    $programEx->program_id = $program->id;
                    $programEx->title = $exercise['title'];
                    $programEx->video_id = $exercise['video_id'];
                    $programEx->sets = $exercise['sets'];
                    $programEx->save();
                }
                // auto join my program
                $joined = new JoinedProgram();
                $joined->program_id = $program->id;
                $joined->user_id = $user_id;
                $joined->save();
            }
            return response()->json(['status' => 'success', 'data' => $program]);
        }  
        else {
            return response()->json(['status' => 'failed', 'msg' => 'Invalid access']);
        }
    }

    public function updateProgram(Request $request)
    {
        $user = User::where(array('access_token' => $request->access_token))->first();
        if ($user) {
            $program = Program::where('id', $request->program_id)->first();
            $program->title = $request->title;
            $program->weekday = $request->weekday; // new
            $exercises = json_decode($request->exercises, true);
            $program->exercises = count($exercises);
            $program->save();
            // delete old program exercises
            ProgramExercise::where(array('program_id' => $request->program_id))->delete();
            // add program exercises
            foreach ($exercises as $exercise) {
                $programEx = new ProgramExercise();
                $programEx->program_id = $request->program_id;
                $programEx->title = $exercise['title'];
                $programEx->video_id = $exercise['video_id'];
                $programEx->sets = $exercise['sets'];
                $programEx->save();
            }
            return response()->json(['status' => 'success', 'data' => $program]);
        }  
        else {
            return response()->json(['status' => 'failed', 'msg' => 'Invalid access']);
        }
    }
    
    public function updateWeeklyProgram(Request $request)
    {
        $user = User::where(array('access_token' => $request->access_token))->first();
        if ($user) {
            // update title for all programs of this week
            $allRelatedPrograms = Program::where('master_id', $request->master_id)->get();
            foreach ($allRelatedPrograms as $relatedProgram) {
                $relatedProgram->title = $request->title;
                $relatedProgram->save();
            }
            $program = Program::where('id', $request->program_id)->first();
            $program->title = $request->title;
            $exercises = json_decode($request->exercises, true);
            $program->exercises = count($exercises);
            $program->save();
            // delete old program exercises
            ProgramExercise::where(array('program_id' => $request->program_id))->delete();
            // add program exercises
            foreach ($exercises as $exercise) {
                $programEx = new ProgramExercise();
                $programEx->program_id = $request->program_id;
                $programEx->title = $exercise['title'];
                $programEx->video_id = $exercise['video_id'];
                $programEx->sets = $exercise['sets'];
                $programEx->save();
            }
            return response()->json(['status' => 'success', 'data' => $program]);
        }  
        else {
            return response()->json(['status' => 'failed', 'msg' => 'Invalid access']);
        }
    }

    public function deleteProgram(Request $request)
    {
        $user = User::where(array('access_token' => $request->access_token))->first();
        if ($user) {
            // get all sub programs (weekly has 7 programs)
            $programs = Program::where(array('master_id' => $request->master_id))->get();
            foreach ($programs as $program) {
                // delete program exercises
                ProgramExercise::where(array('program_id' => $program->id))->delete();
                // remove program join (for all users)
                JoinedProgram::where(array('program_id' => $program->id))->delete();
            }
            // delete master program (all sub programs)
            Program::where(array('master_id' => $request->master_id))->delete();
            return response()->json(['status' => 'success', 'data' => 'done']);
        }  
        else {
            return response()->json(['status' => 'failed', 'msg' => 'Invalid access']);
        }
    }

    public function joinFriendProgram(Request $request)
    {
        $user = User::where(array('access_token' => $request->access_token))->first();
        if ($user) {
            // get all sub programs (weekly has 7 programs)
            $programs = Program::where(array('master_id' => $request->master_id))->get();
            foreach ($programs as $program) {
                if($request->join == '1'){
                    // join all sub programs
                    $joined = new JoinedProgram();
                    $joined->program_id = $program->id;
                    $joined->user_id = $request->user_id;
                    $joined->save();
                }
                else{
                    // remove all joins
                    JoinedProgram::where(array('program_id' => $program->id, 'user_id' => $request->user_id))->delete();
                }
            }
            return response()->json(['status' => 'success', 'data' => 'done']);
        }  
        else {
            return response()->json(['status' => 'failed', 'msg' => 'Invalid access']);
        }
    }

    public function getProgramDetails(Request $request)
    {
        $user = User::where(array('access_token' => $request->access_token))->first();
        if ($user) {
            $resultArr = [];
            $programs = Program::where(array('master_id' => $request->master_id))->get();
            foreach ($programs as $program) {
                $exercises = ProgramExercise::where('program_id', $program->id)->with(['video'])->get();
                // check joined
                $joined = JoinedProgram::where(array('user_id' => $request->user_id, 'program_id' => $program->id))->first();
                if($joined){
                    $program->joined = '1';
                }
                else{
                    $program->joined = '0';
                }
                $program->program_exercises = $exercises;
                $resultArr[] = $program;
            }
            return response()->json(['status' => 'success', 'data' => $resultArr]);
        }  
        else {
            return response()->json(['status' => 'failed', 'msg' => 'Invalid access']);
        }
    }

    public function addSpecialProgram(Request $request)
    {
        $user = User::where(array('access_token' => $request->access_token))->first();
        if ($user) {
            $program = new SpecialProgram();
            $program->price = $request->price;
            $program->age = $request->age;
            $program->goal = $request->goal;
            $program->title = $request->title;
            if ($request->hasFile('image')) {
                try {
                    $file_name = $this->addAttachments($request->file('image'), SpecialProgram::$imagesPath);
                    $program->image = $file_name;
                } catch (Exception $ex) {
                    return response()->json(['status' => 'failed', 'msg' => 'upload failed']);
                }
            }

            $videos = json_decode($request->videos, true);
            $program->videos = count($videos);

            $sections = json_decode($request->sections, true);
            $program->sections = count($sections);

            $other_programs = json_decode($request->programs, true);
            $program->programs = count($other_programs);

            $program->save();

            // add video links
            foreach ($videos as $video) {
                $videoLink = new SpecialVideoLink();
                $videoLink->special_pid = $program->id;
                $videoLink->video_id = $video['video_id'];
                $videoLink->save();
            }
            // add section links
            foreach ($sections as $section) {
                $sectionLink = new SpecialSectionLink();
                $sectionLink->special_pid = $program->id;
                $sectionLink->cat_id = $section['cat_id'];
                $sectionLink->save();
            }
            // add program links
            foreach ($other_programs as $other_program) {
                $programLink = new SpecialProgramLink();
                $programLink->special_pid = $program->id;
                $programLink->other_pid = $other_program['other_pid'];
                $programLink->save();
            }

            return response()->json(['status' => 'success', 'data' => $program]);
        }  
        else {
            return response()->json(['status' => 'failed', 'msg' => 'Invalid access']);
        }
    }

    public function getSpecialPrograms(Request $request)
    {
        $resultArr = [];
        $programs = [];
        if($request->type == 'all'){
            $programs = SpecialProgram::orderBy('added_date','asc')->get();
        }
        else if($request->type == 'free'){
            $programs = SpecialProgram::where('price', '=', 0)->orderBy('added_date','asc')->get();
        }
        else{ //paid
            $programs = SpecialProgram::where('price', '>', 0)->orderBy('added_date','asc')->get();
        }

        foreach ($programs as $program) {
            // check joined
            $joined = JoinedSpecialProgram::where(array('user_id' => $request->user_id, 'special_pid' => $program->id))->first();
            if($joined){
                $program->joined = '1';
            }
            else{
                $program->joined = '0';
            }
            if($request->age == '1' && $request->goal == '1'){
                $resultArr[] = $program;
            }
            else if($request->age != '1' && $request->goal == '1'){
                if($program->age == $request->age){
                    $resultArr[] = $program;
                }
            }
            else if($request->age == '1' && $request->goal != '1'){
                if($program->goal == $request->goal){
                    $resultArr[] = $program;
                }
            }
            else {
                if($program->age == $request->age && $program->goal == $request->goal){
                    $resultArr[] = $program;
                }
            }
        }

        return response()->json(['status' => 'success', 'data' => $resultArr]);
    }

    public function getJoinedSpecialPrograms(Request $request)
    {
        $user = User::where(array('access_token' => $request->access_token))->first();
        if ($user) {
            $programs = JoinedSpecialProgram::where('user_id', $request->user_id)->with(['specialProgram'])->get();
            return response()->json(['status' => 'success', 'data' => $programs]);
        }  
        else {
            return response()->json(['status' => 'failed', 'msg' => 'Invalid access']);
        }
    }

    public function joinSpecialProgram(Request $request)
    {
        $user = User::where(array('access_token' => $request->access_token))->first();
        if ($user) {
            if($request->join == '1'){
                // check already joined
                $temp = JoinedSpecialProgram::where(array('special_pid' => $request->special_pid, 'user_id' => $request->user_id))->first();
                if($temp){
                    return response()->json(['status' => 'failed', 'msg' => 'Already Joined!']); 
                }
                $joined = new JoinedSpecialProgram();
                $joined->special_pid = $request->special_pid;
                $joined->user_id = $request->user_id;
                $joined->save();
            }
            else{
                // remove join
                JoinedSpecialProgram::where(array('special_pid' => $request->special_pid, 'user_id' => $request->user_id))->delete();
            }
            return response()->json(['status' => 'success', 'data' => 'done']);
        }  
        else {
            return response()->json(['status' => 'failed', 'msg' => 'Invalid access']);
        }
    }

    public function getSpecialProgramDetails(Request $request)
    {
        $user = User::where(array('access_token' => $request->access_token))->first();
        if ($user) {
            $program = SpecialProgram::where('id', $request->special_pid)->first();
            if($program){
                // check joined
                $joined = JoinedSpecialProgram::where(array('user_id' => $request->user_id, 'special_pid' => $request->special_pid))->first();
                if($joined){
                    $program->joined = '1';
                }
                else{
                    $program->joined = '0';
                }
                // get video links, sections, other programs
                $videoLinks = SpecialVideoLink::where('special_pid', $request->special_pid)->with(['video'])->get();
                $sectionLinks = SpecialSectionLink::where('special_pid', $request->special_pid)->with(['category'])->get();
                $programLinks = SpecialProgramLink::where('special_pid', $request->special_pid)->with(['specialProgram'])->get();
                $program->videoLinks = $videoLinks;
                $program->sectionLinks = $sectionLinks;
                $program->programLinks = $programLinks;
                return response()->json(['status' => 'success', 'data' => $program]);
            }
            else{
                return response()->json(['status' => 'failed', 'msg' => 'Program not found']);
            }
        }
        else {
            return response()->json(['status' => 'failed', 'msg' => 'Invalid access']);
        }
    }

    private function addAttachments($file, $path)
    {
        $destination = public_path($path);
        $fileName = time() . '_' . $file->getClientOriginalName();
        $file->move($destination, $fileName);
        return $fileName;
    }
    
}
