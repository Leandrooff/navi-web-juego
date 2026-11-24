<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Story;
use Illuminate\Http\Request;
class StoryController extends Controller {
 public function index() {
  return ['data'=>Story::where('status','published')->with('category')->orderBy('story_order')->get()];
 }
 public function show(Request $r,int $id) {
  $s=Story::where('status','published')->with('category')->findOrFail($id);
  $v=$r->validate(['version'=>'nullable|integer|min:1']);
  $version=$v['version']??$s->version;
  abort_if($version>$s->version,404);
  $s->load(['scenes'=>fn($q)=>$q->where('content_version',$version)->orderBy('scene_order')->with('choices')]);
  abort_unless($s->scenes->count(),404,'Esta edición de la aventura no está disponible.');
  $s->version=$version;
  $s->initial_scene_id=$s->scenes->first()->id;
  return ['data'=>$s];
 }
}
