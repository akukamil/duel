var M_WIDTH = 800, M_HEIGHT = 450;
var app, game_res, gres, objects = {}, my_data = {}, opp_data = {};
var g_process = () => {};

var any_dialog_active = 0, net_play = 0;

var guide_line = new PIXI.Graphics();
var guide_line2 = new PIXI.Graphics();
var drag = 0, game_tick = 0, state = "";
var skl_prepare, skl_throw, skl_lose;
var charge_spd=0.005;
var test_sprite;
var load_list=[["image","bcg_0",""],["block","bcg","objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=-10;objects[obj_name].y=-10;objects[obj_name].interactive=true;","objects[obj_name].texture=gres.bcg_0.texture;app.stage.addChild(objects[obj_name]);"],["block","player_name_text","objects[obj_name]=new PIXI.BitmapText('', {font: '27px Century Gothic',align: 'center'});objects[obj_name].anchor.set(0,0);objects[obj_name].x=130;objects[obj_name].y=25;objects[obj_name].base_tint=objects[obj_name].tint=0X333F50;",""],["cont","player_name_cont","objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=-20;objects[obj_name].sy=objects[obj_name].y=-25;","app.stage.addChild(objects[obj_name]);objects[obj_name].addChild(objects.player_name_text);objects[obj_name].addChild(objects.player_rating_text);objects[obj_name].addChild(objects.my_avatar);"],["block","my_avatar","objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=30;objects[obj_name].sy=objects[obj_name].y=35;objects[obj_name].width=90;objects[obj_name].height=80;",""],["block","player_rating_text","objects[obj_name]=new PIXI.BitmapText('', {font: '25px Century Gothic',align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=75;objects[obj_name].y=115;objects[obj_name].base_tint=objects[obj_name].tint=0X385723;",""],["block","opponent_name_text","objects[obj_name]=new PIXI.BitmapText('', {font: '27px Century Gothic',align: 'center'});objects[obj_name].anchor.set(1,0);objects[obj_name].x=130;objects[obj_name].y=20;objects[obj_name].base_tint=objects[obj_name].tint=0X333F50;",""],["cont","opponent_name_cont","objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=560;objects[obj_name].sy=objects[obj_name].y=-20;objects[obj_name].show=function(){this.children.forEach(c=>{c.alpha=1;c.visible=true})};","app.stage.addChild(objects[obj_name]);objects[obj_name].addChild(objects.opponent_name_text);objects[obj_name].addChild(objects.opponent_rating_text);objects[obj_name].addChild(objects.opponent_avatar);"],["block","opponent_avatar","objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=140;objects[obj_name].sy=objects[obj_name].y=30;objects[obj_name].width=90;objects[obj_name].height=80;",""],["block","opponent_rating_text","objects[obj_name]=new PIXI.BitmapText('', {font: '25px Century Gothic',align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=185;objects[obj_name].y=110;objects[obj_name].base_tint=objects[obj_name].tint=0X385723;",""],["block","online_users_text","objects[obj_name]=new PIXI.BitmapText('', {font: '25px Century Gothic'});objects[obj_name].anchor.set(0,0.5);objects[obj_name].x=10;objects[obj_name].y=420;objects[obj_name].base_tint=objects[obj_name].tint=0XFF0000;","app.stage.addChild(objects[obj_name]);"],["cont","search_opponent_window","objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=200;objects[obj_name].sy=objects[obj_name].y=60;objects[obj_name].show=function(){this.children.forEach(c=>{c.alpha=1;c.tint=c.base_tint})};","app.stage.addChild(objects[obj_name]);objects[obj_name].addChild(objects.search_opponent_bcg);objects[obj_name].addChild(objects.search_opponent_progress);objects[obj_name].addChild(objects.search_window_close);"],["sprite","search_opponent_bcg","objects[obj_name].x=10;objects[obj_name].y=10;objects[obj_name].base_tint=objects[obj_name].tint;",""],["sprite","search_window_close","objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].pointerdown=function(){search_opponent.cancel()};objects[obj_name].x=316;objects[obj_name].y=30;objects[obj_name].base_tint=objects[obj_name].tint;","objects[obj_name].pointerover=function(){this.tint=0xff0000};objects[obj_name].pointerout=function(){this.tint=0xffffff};"],["sprite","search_opponent_progress","objects[obj_name].anchor.set(0.5,0.5);objects[obj_name].x=195;objects[obj_name].y=200;",""],["image","stand",""],["block","headshot","objects[obj_name]=new PIXI.Sprite();objects[obj_name].width=130;objects[obj_name].height=110;objects[obj_name].y=130;objects[obj_name].visible=false;","objects[obj_name].texture=game_res.resources['headshot'].texture;app.stage.addChild(objects[obj_name]);"],["image","bcg_1",""],["image","life_level_bcg",""],["image","life_level_front",""],["image","life_level_frame",""],["image","headshot",""],["sprite","sprite_001","objects[obj_name].x=210;objects[obj_name].y=10;objects[obj_name].base_tint=objects[obj_name].tint;","app.stage.addChild(objects[obj_name]);"],["sprite","my_data_bcg","objects[obj_name].x=10;objects[obj_name].y=10;",""],["block","my_data_photo","objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=20;objects[obj_name].sy=objects[obj_name].y=20;objects[obj_name].width=40;objects[obj_name].height=40;",""],["block","my_data_name","objects[obj_name]=new PIXI.BitmapText('', {font: '30px Century Gothic',align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=150;objects[obj_name].y=20;",""],["block","my_data_rating","objects[obj_name]=new PIXI.BitmapText('', {font: '30px Century Gothic',align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=150;objects[obj_name].y=40;objects[obj_name].base_tint=objects[obj_name].tint=0X000000;",""],["cont","my_data_cont","objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=280;objects[obj_name].sy=objects[obj_name].y=-16;","objects[obj_name].addChild(objects.my_data_bcg);objects[obj_name].addChild(objects.my_data_photo);objects[obj_name].addChild(objects.my_data_name);objects[obj_name].addChild(objects.my_data_rating);app.stage.addChild(objects[obj_name]);"],["sprite","dir_line","objects[obj_name].x=20;objects[obj_name].y=300;objects[obj_name].visible=false;objects[obj_name].anchor.set(0,0.5);","app.stage.addChild(objects[obj_name]);"],["image","dir_line2",""],["cont","power_level_cont","objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].ready=true;objects[obj_name].sx=objects[obj_name].x=250;objects[obj_name].sy=objects[obj_name].y=100;","app.stage.addChild(objects[obj_name]);objects[obj_name].addChild(objects.power_slider);objects[obj_name].addChild(objects.power_bcg);"],["sprite","power_slider","objects[obj_name].x=objects[obj_name].sx=20;objects[obj_name].y=objects[obj_name].sy=20;",""],["sprite","power_bcg","objects[obj_name].x=objects[obj_name].sx=10;objects[obj_name].y=objects[obj_name].sy=10;",""],["block","power_level_text","objects[obj_name]=new PIXI.BitmapText('100%', {font: '35px Century Gothic',align: 'center'});objects[obj_name].x=120;objects[obj_name].y=40;objects[obj_name].anchor.set(0.5,0.5);",""],["sprite","play_button","objects[obj_name].x=10;objects[obj_name].y=10;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].pointerdown=function(){main_menu.play_button_down()};objects[obj_name].pointerover=function(){this.tint=0x55ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};",""],["sprite","lb_button","objects[obj_name].x=150;objects[obj_name].y=10;objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].pointerdown=function(){main_menu.lb_button_down()};objects[obj_name].pointerover=function(){this.tint=0x55ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};objects[obj_name].base_tint=objects[obj_name].tint;",""],["sprite","rules_button","objects[obj_name].x=290;objects[obj_name].y=10;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].pointerdown=function(){main_menu.rules_button_down()};objects[obj_name].pointerover=function(){this.tint=0x55ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};",""],["cont","main_buttons_cont","objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=190;objects[obj_name].sy=objects[obj_name].y=240;","objects[obj_name].addChild(objects.play_button);objects[obj_name].addChild(objects.lb_button);objects[obj_name].addChild(objects.rules_button);app.stage.addChild(objects[obj_name]);"],["image","lb_bcg",""],["image","lb_player_card_bcg",""],["block","lb_cards_cont","objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=0;","for (let i=0;i<7;i++)objects[obj_name].addChild(objects.lb_cards[i]);app.stage.addChild(objects[obj_name]);"],["array","lb_cards",7,"var num=n;objects[obj_name][num]=new lb_player_card_class(0,0,num+4);",""],["block","lb_back_button","objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=700;objects[obj_name].y=320;objects[obj_name].visible=false;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].pointerdown=function(){lb.back_button_down()};objects[obj_name].pointerover=function(){this.tint=0x55ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};","objects[obj_name].texture=objects.back_button.texture;app.stage.addChild(objects[obj_name]);"],["block","lb_1_avatar","objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=10;objects[obj_name].sy=objects[obj_name].y=50;objects[obj_name].width=170;objects[obj_name].height=170;","objects[obj_name].mask=objects.lb_1_mask;"],["sprite","lb_1_mask","objects[obj_name].x=10;objects[obj_name].y=50;",""],["cont","lb_1_cont","objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=10;objects[obj_name].sy=objects[obj_name].y=1480-1510+40;","objects[obj_name].addChild(objects.lb_1_mask);objects[obj_name].addChild(objects.lb_1_avatar);objects[obj_name].addChild(objects.lb_1_frame);objects[obj_name].addChild(objects.lb_1_crown);objects[obj_name].addChild(objects.lb_1_name);objects[obj_name].addChild(objects.lb_1_rating);app.stage.addChild(objects[obj_name]);"],["block","lb_1_name","objects[obj_name]=new PIXI.BitmapText('Иван Семенов', {font: '35px Century Gothic',align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=95;objects[obj_name].y=166;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFF00;",""],["block","lb_1_rating","objects[obj_name]=new PIXI.BitmapText('1899', {font: '30px Century Gothic',align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=95;objects[obj_name].y=190;objects[obj_name].base_tint=objects[obj_name].tint=0XBDD7EE;",""],["sprite","lb_1_frame","objects[obj_name].x=10;objects[obj_name].y=50;",""],["sprite","lb_1_crown","objects[obj_name].x=98;objects[obj_name].y=24;",""],["block","lb_2_avatar","objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=20;objects[obj_name].sy=objects[obj_name].y=50;objects[obj_name].width=130;objects[obj_name].height=130;","objects[obj_name].mask=objects.lb_2_mask;"],["sprite","lb_2_mask","objects[obj_name].x=10;objects[obj_name].y=40;",""],["block","lb_2_name","objects[obj_name]=new PIXI.BitmapText('Игорь Васильев', {font: '32px Century Gothic',align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=85;objects[obj_name].y=140;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFF00;",""],["block","lb_2_rating","objects[obj_name]=new PIXI.BitmapText('1455', {font: '30px Century Gothic',align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=88;objects[obj_name].y=166;objects[obj_name].base_tint=objects[obj_name].tint=0XBDD7EE;",""],["cont","lb_2_cont","objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=130;objects[obj_name].sy=objects[obj_name].y=1635-1510+40;","objects[obj_name].addChild(objects.lb_2_avatar);objects[obj_name].addChild(objects.lb_2_mask);objects[obj_name].addChild(objects.lb_2_frame);objects[obj_name].addChild(objects.lb_2_crown);objects[obj_name].addChild(objects.lb_2_name);objects[obj_name].addChild(objects.lb_2_rating);app.stage.addChild(objects[obj_name]);"],["sprite","lb_2_frame","objects[obj_name].x=10;objects[obj_name].y=40;",""],["sprite","lb_2_crown","objects[obj_name].x=87;objects[obj_name].y=17;",""],["sprite","back_button","objects[obj_name].x=830;objects[obj_name].y=1810;objects[obj_name].visible=false;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].pointerdown=function(){cards_menu.back_button_down()};objects[obj_name].pointerover=function(){this.tint=0x55ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};","app.stage.addChild(objects[obj_name]);"],["block","lb_3_avatar","objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=40;objects[obj_name].sy=objects[obj_name].y=50;objects[obj_name].width=120;objects[obj_name].height=120;","objects[obj_name].mask=objects.lb_3_mask;"],["sprite","lb_3_mask","objects[obj_name].x=40;objects[obj_name].y=50;",""],["block","lb_3_name","objects[obj_name]=new PIXI.BitmapText('Махмуд Аббас', {font: '30px Century Gothic',align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=100;objects[obj_name].y=130;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFF00;",""],["block","lb_3_rating","objects[obj_name]=new PIXI.BitmapText('1234', {font: '28px Century Gothic',align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=100;objects[obj_name].y=150;objects[obj_name].base_tint=objects[obj_name].tint=0XBDD7EE;",""],["cont","lb_3_cont","objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=-13;objects[obj_name].sy=objects[obj_name].y=1716-1510+40;","objects[obj_name].addChild(objects.lb_3_avatar);objects[obj_name].addChild(objects.lb_3_mask);objects[obj_name].addChild(objects.lb_3_frame);objects[obj_name].addChild(objects.lb_3_crown);objects[obj_name].addChild(objects.lb_3_name);objects[obj_name].addChild(objects.lb_3_rating);app.stage.addChild(objects[obj_name]);"],["sprite","lb_3_frame","objects[obj_name].x=40;objects[obj_name].y=50;",""],["sprite","lb_3_crown","objects[obj_name].x=11;objects[obj_name].y=22;",""],["sprite","big_message_bcg","objects[obj_name].x=10;objects[obj_name].y=10;objects[obj_name].base_tint=objects[obj_name].tint;",""],["block","big_message_text","objects[obj_name]=new PIXI.BitmapText('', {font: '25px Century Gothic', align: 'center'});objects[obj_name].anchor.set(0.5,0,5);objects[obj_name].maxWidth=270;objects[obj_name].x=160;objects[obj_name].y=30;objects[obj_name].base_tint=objects[obj_name].tint=0XF2F2F2;",""],["cont","big_message_cont","objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=240;objects[obj_name].sy=objects[obj_name].y=40;objects[obj_name].show=function(){this.children.forEach(c=>{c.alpha=1;c.tint=c.base_tint})};","objects[obj_name].addChild(objects.big_message_bcg);objects[obj_name].addChild(objects.big_message_text);objects[obj_name].addChild(objects.close_big_message);objects[obj_name].addChild(objects.big_message_text2);app.stage.addChild(objects[obj_name]);"],["sprite","close_big_message","objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].x=99;objects[obj_name].y=147;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].pointerover=function(){this.tint=0x55ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};objects[obj_name].pointerdown=function(){big_message.close()};    ",""],["block","big_message_text2","objects[obj_name]=new PIXI.BitmapText('------', {font: '30px Century Gothic', align: 'center'});objects[obj_name].anchor.set(0.5,0,5);objects[obj_name].maxWidth=270;objects[obj_name].x=159;objects[obj_name].y=97;objects[obj_name].base_tint=objects[obj_name].tint=0XFFC000;",""],["image","blood_particle",""],["block","enemy","objects[obj_name]=new player_class('enemy');objects[obj_name].scale.x=-1;objects[obj_name].sx=objects[obj_name].x=810;objects[obj_name].sy=objects[obj_name].y=270;objects[obj_name].visible=false;","objects[obj_name].stand.texture=game_res.resources.stand.texture;app.stage.addChild(objects[obj_name]);"],["image","sm_left_arm1",""],["image","sm_right_arm1",""],["image","sm_spine",""],["image","sm_right_leg1",""],["image","sm_left_arm2",""],["image","sm_left_leg1",""],["image","sm_projectile",""],["image","sm_right_arm2",""],["image","sm_left_leg2",""],["image","sm_right_leg2",""],["block","player","objects[obj_name]=new player_class('player');objects[obj_name].sx=objects[obj_name].x=-10;objects[obj_name].sy=objects[obj_name].y=270;objects[obj_name].visible=false;","objects[obj_name].stand.texture=game_res.resources.stand.texture;app.stage.addChild(objects[obj_name]);"],["image","gl_left_arm1",""],["image","gl_right_arm1",""],["image","gl_spine",""],["image","gl_right_leg1",""],["image","gl_left_arm2",""],["image","gl_left_leg1",""],["image","gl_projectile",""],["image","gl_right_arm2",""],["image","gl_left_leg2",""],["image","gl_right_leg2",""],["image","ff_left_arm1",""],["image","ff_right_arm1",""],["image","ff_spine",""],["image","ff_right_leg1",""],["image","ff_left_arm2",""],["image","ff_left_leg1",""],["image","ff_projectile",""],["image","ff_right_arm2",""],["image","ff_left_leg2",""],["image","ff_right_leg2",""],["image","bs_left_arm1",""],["image","bs_right_arm1",""],["image","bs_spine",""],["image","bs_right_leg1",""],["image","bs_left_arm2",""],["image","bs_left_leg1",""],["image","bs_projectile",""],["image","bs_right_arm2",""],["image","bs_left_leg2",""],["image","bs_right_leg2",""],["sprite","next_fp_button","objects[obj_name].x=10;objects[obj_name].y=220;objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].pointerdown=function(){fp_menu.next_fp_down()};objects[obj_name].pointerover=function(){this.tint=0x55ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};objects[obj_name].base_tint=objects[obj_name].tint;",""],["sprite","save_fp_button","objects[obj_name].x=150;objects[obj_name].y=220;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].pointerdown=function(){fp_menu.save_fp_down()};objects[obj_name].pointerover=function(){this.tint=0x55ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};",""],["cont","fp_cont","objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=0;objects[obj_name].sy=objects[obj_name].y=0;","objects[obj_name].addChild(objects.fp_avatar);objects[obj_name].addChild(objects.fp_name_text);objects[obj_name].addChild(objects.fp_last_seen_text);objects[obj_name].addChild(objects.next_fp_button);objects[obj_name].addChild(objects.save_fp_button);app.stage.addChild(objects[obj_name]);"],["block","fp_avatar","objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=20;objects[obj_name].sy=objects[obj_name].y=10;objects[obj_name].width=90;objects[obj_name].height=80;",""],["block","fp_name_text","objects[obj_name]=new PIXI.BitmapText('', {font: '25px Century Gothic',align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=105;objects[obj_name].y=110;objects[obj_name].base_tint=objects[obj_name].tint=0X385723;",""],["block","fp_last_seen_text","objects[obj_name]=new PIXI.BitmapText('', {font: '25px Century Gothic',align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=105;objects[obj_name].y=140;objects[obj_name].base_tint=objects[obj_name].tint=0X385723;",""]];

class lb_player_card_class extends PIXI.Container{
	
	constructor(x,y,place) {
		super();

		this.bcg=new PIXI.Sprite(game_res.resources.lb_player_card_bcg.texture);
		this.bcg.interactive=true;
		this.bcg.pointerover=function(){this.tint=0x55ffff};
		this.bcg.pointerout=function(){this.tint=0xffffff};
				
		
		this.place=new PIXI.BitmapText("1", {font: '25px Century Gothic'});
		this.place.x=20;
		this.place.y=20;
		
		this.avatar=new PIXI.Sprite();
		this.avatar.x=40;
		this.avatar.y=10;
		this.avatar.width=this.avatar.height=48;
		
		
		this.name=new PIXI.BitmapText('Игорь Николаев', {font: '25px Century Gothic'});
		this.name.x=100;
		this.name.y=20;
		
	
		this.rating=new PIXI.BitmapText('1422', {font: '35px Century Gothic'});
		this.rating.x=300;
		this.rating.tint=0x00ffff;
		this.rating.y=20;		
		
		this.addChild(this.bcg,this.place, this.avatar, this.name, this.rating);		
	}
	
	
}

var particle_engine = {

	particles : class {
		
		constructor() {
			
			this.active=0;
			this.sx= 0;
			this.sy= 0;
			this.start_time= -999;
			this.dir = 0;
			this.coll_obj=0;
			this.coll_obj_id=0;
			this.target_name="";
			
			this.p=[];
			for (let i = 0; i < 30; i++) {
				
				const prtcl = new PIXI.Sprite(game_res.resources["blood_particle"].texture);
				prtcl.visible = false;
				prtcl.y_inc = Math.random() / 50 + 0.01;
				prtcl.x_spd = Math.random() * 5 + 3;
				prtcl.sx = prtcl.sy = prtcl.x_traveled = 0;
				prtcl.i=0;
				prtcl.anchor.set(0.5, 0.5);
				prtcl.alpha=0.7;
				this.p.push(prtcl);
				app.stage.addChild(prtcl);
			}			
			
		};
		
		activate = function (int_x,int_y,dir,P, coll_obj, coll_obj_id) {
			
			this.coll_obj=coll_obj;
			this.coll_obj_id=coll_obj_id;
			
			//вычисляем расстояние от начала линии коллизии до точки пересечения
			let dx=int_x-this.coll_obj[this.coll_obj_id][0];
			let dy=int_y-this.coll_obj[this.coll_obj_id][1];
			this.disp=Math.sqrt(dx*dx+dy*dy);
			this.dir = dir;
			this.target_name=this.dir > 0 ? "player" : "enemy";
			this.P=P;
			this.active=1;
			this.start_time = game_tick;
			
		
		};
		
		add_particle = function () {
			
			for (let i = 0; i < this.p.length; i++) {
				let prtcl = this.p[i];
				if (prtcl.visible === false) {
					
					let dx=this.coll_obj[this.coll_obj_id+1][0]-this.coll_obj[this.coll_obj_id][0];
					let dy=this.coll_obj[this.coll_obj_id+1][1]-this.coll_obj[this.coll_obj_id][1];
					let d=Math.sqrt(dx*dx+dy*dy);
					dx=dx/d;
					dy=dy/d;			
					
					prtcl.x = prtcl.sx = this.coll_obj[this.coll_obj_id][0]+dx*this.disp;
					prtcl.y = prtcl.sy = this.coll_obj[this.coll_obj_id][1]+dy*this.disp;
					prtcl.scale.x = prtcl.scale.y = 0.6;
					prtcl.x_traveled = 0;
					prtcl.i=0;
					prtcl.x_spd=Math.random() * 5 + 3+this.P*0.05;
					prtcl.y_inc = Math.random() / 50 + 0.01;
					prtcl.visible = true;
					prtcl.rotation=Math.random()*6.28;
					prtcl.alpha = 0.7;
					this.active=1;
					return;
				}
			}
			
		};
		
		process = function () {
						
			if (this.active===0)
				return;			
			
			//постоянно добавляем частицы
			if (game_tick < this.start_time + this.P*0.01)
				this.add_particle();
			
			//обрабатываем все частицы
			this.active=0;
			this.p.forEach(item => {

				if (item.visible === true) {

					this.active=1;
	
					item.x_traveled += item.x_spd * this.dir;
					item.x = item.sx + item.x_traveled;
					item.i += 0.2;
					item.y += item.i*item.i;

					item.scale.x -= 0.01;
					item.scale.y -= 0.01;
					//item.alpha = 1-(item.y-this.sy)/100;
					
					if (item.y > item.sy+100)
						item.visible = false;
				}
			})

		}
	},
	
	load : function () {
		
		this.bloods=[];
		for (let i=0;i<5;i++)
			this.bloods.push(new this.particles());
	},
		
	add: function(int_x,int_y,dir,P, coll_obj, coll_obj_id) {
		
		for (let i=0;i<this.bloods.length;i++) {
			
			if (this.bloods[i].active===0) {
				
				this.bloods[i].activate(int_x,int_y,dir,P, coll_obj, coll_obj_id);		
				return;				
			}
		}
	},
	
	process: function () {
		
		this.bloods.forEach((item)=>{			
			item.process();
		})		
	}


}

skl_anim=	{
		
		
	slots: [{cont: 'player', source: 0,	pos:0,	time:0,	speed:0, on:0},{cont: 'enemy', source: 0,	pos:0,	time:0,	speed:0, on:0}],
	
	activate: function(cont_id,source) {		
		this.slots[cont_id].on=1;
		this.slots[cont_id].source=source;
		this.slots[cont_id].pos=0;
		this.slots[cont_id].time=0;
		this.slots[cont_id].speed=0.5;
	},

	process: function() {
		
		this.slots.forEach(p => {

			if (p.on===0)
				return;
					
			for (var s in p.source) {
				
				objects[p.cont][s].x=p.source[s][p.pos][0];
				objects[p.cont][s].y=p.source[s][p.pos][1];
				objects[p.cont][s].rotation=p.source[s][p.pos][2];
			}
					
			p.time+=p.speed;
			p.pos=Math.floor(p.time);
			if (p.pos>=p.source["left_arm1"].length)
				p.on=0;
		})
				
			
	},
	
	tween: function(cont,source,amount) {
		
		for (var s in source) {
			
			cont[s].x=source[s][0][0]+source[s][2][0]*amount;
			cont[s].y=source[s][0][1]+source[s][2][1]*amount;
			cont[s].rotation=source[s][0][2]+source[s][2][2]*amount;
			
		}
		
	},
	
	goto_frame: function(cont, source, frame_id) {
		
		for (var s in source) {
			
			cont[s].x=source[s][frame_id][0];
			cont[s].y=source[s][frame_id][1];
			cont[s].rotation=source[s][frame_id][2];
		}				
	}			
}   

class player_class extends PIXI.Container{
	
	constructor(name) {
		
		super();
		
		this.name=name;
		
		this.spine=new PIXI.Sprite(); this.spine.width=40;	this.spine.height=80;	this.spine.anchor.set(0.5,0.5);
		
		this.left_arm1=new PIXI.Sprite();	this.left_arm1.width=40;	this.left_arm1.height=20;	this.left_arm1.anchor.set(0.5,0.5);
		this.left_arm2=new PIXI.Sprite();	this.left_arm2.width=40;	this.left_arm2.height=20;	this.left_arm2.anchor.set(0.5,0.5);
		this.right_arm1=new PIXI.Sprite();	this.right_arm1.width=40;	this.right_arm1.height=20;	this.right_arm1.anchor.set(0.5,0.5);
		this.right_arm2=new PIXI.Sprite();	this.right_arm2.width=40;	this.right_arm2.height=20;	this.right_arm2.anchor.set(0.5,0.5);
		
		this.left_leg1=new PIXI.Sprite();	this.left_leg1.width=40;	this.left_leg1.height=20;	this.left_leg1.anchor.set(0.5,0.5);
		this.left_leg2=new PIXI.Sprite();	this.left_leg2.width=40;	this.left_leg2.height=20;	this.left_leg2.anchor.set(0.5,0.5);
		this.right_leg1=new PIXI.Sprite();	this.right_leg1.width=40;	this.right_leg1.height=20;	this.right_leg1.anchor.set(0.5,0.5);
		this.right_leg2=new PIXI.Sprite();	this.right_leg2.width=40;	this.right_leg2.height=20;	this.right_leg2.anchor.set(0.5,0.5);
		
		this.projectile=new PIXI.Sprite();	this.projectile.width=90;	this.projectile.height=20;	this.projectile.anchor.set(0.5,0.5);
				
		this.stand=new PIXI.Sprite();
		this.stand.x=10;
		this.stand.y=135;		
		
		this.life_level_bcg=new PIXI.Sprite(game_res.resources.life_level_bcg.texture);
		this.life_level_bcg.x=10;
		this.life_level_frame=new PIXI.Sprite(game_res.resources.life_level_frame.texture);
		this.life_level_frame.x=10;
		this.life_level_front=new PIXI.Sprite(game_res.resources.life_level_front.texture);		
		this.life_level_front.x=20;
		
				
		this.addChild(this.spine,this.left_arm1,this.left_arm2,this.right_arm1,this.right_arm2,this.left_leg1,this.left_leg2,this.right_leg1,
		this.right_leg2,this.stand,this.projectile,this.life_level_bcg,this.life_level_front,this.life_level_frame);
		
		this.base_col=JSON.parse(JSON.stringify(col_data));		
		this.cur_col=JSON.parse(JSON.stringify(col_data));			
		
		this.tm=0;
		this.next_p=0;
		this.next_time=0;
		
		this.life_level=100;

	};
	
    shift_height(h_dist) {
        anim.add_pos({obj: this, param: 'y',  vis_on_end: true,  func: 'easeOutBack', val: ['y', this.sy + h_dist], speed: 0.02 });
    };
	
	decrease_life(val) {
		
		let new_lev=this.life_level-val;
		new_lev=Math.max(0,new_lev);	
		this.life_level=new_lev;
		this.life_level_front.scale.x=this.life_level*0.01;
	};
	
	process() {
			
		
		test_sprite.lineStyle(2, 0xffffff);
		test_sprite.moveTo(0,0);
		
		//обновляем коллизии		
		for (let i=0;i<this.base_col.length;i++) {
			
			let limb_name=this.base_col[i][0];
			let ref_name=this.base_col[i][1];
			let data=this.base_col[i][2];
			
			let rot=this[ref_name].rotation;	
			
			for (let p = 0; p < data.length; p++) {
				
				let x=data[p][0];
				let y=data[p][1];

				let tx = x * Math.cos(rot) - y * Math.sin(rot);
				let ty = x * Math.sin(rot) + y * Math.cos(rot);


				if (this.scale.x===1) {
					this.cur_col[i][2][p][0] = this.x+this[ref_name].x+tx;
					this.cur_col[i][2][p][1] = this.y+this[ref_name].y+ty;					
				} else {
					this.cur_col[i][2][p][0] = this.x-this[ref_name].x-tx;
					this.cur_col[i][2][p][1] = this.y+this[ref_name].y+ty;		
				}
			
				test_sprite.lineTo(this.cur_col[i][2][p][0],this.cur_col[i][2][p][1]);
			}; 		
		}
		
		//обрабатываем данный код только если идет игра
		if (state!=="playing")
			return;			
				
		//для оппонента обновляем дополнительные процессы
		if(this.scale.x===-1) {
			
			if (game_tick>this.tm+this.next_time) {

				
				let v0=this.next_p;
				let x0 = objects.enemy.x+objects.enemy.width/2;
				let y0 = objects.enemy.y+50;

				let x1 = objects.player.x+objects.player.width/2;
				let y1 = objects.player.y+65;
				
				let dx=x0-x1;
				let dh=y1-y0;
				
				//решение уравнения взято отсюда https://www.youtube.com/watch?v=32PiZDW40VI
				let R=dx/v0; R=R*R*4.9;
				let a=R;
				let b=dx;
				let c=R-dh;
				let Q1=-Math.random()*0.3;
				let Q2=0;
						
				let root1= b * b - (4 * a * c);
				
				//если есть решение то используем его
				if (root1>=0) {					
					let root = Math.sqrt(root1);					
					let tanQ1 = (-b + root) / (2 * a);
					let tanQ2 = (-b - root) / (2 * a);					
					Q1=Math.atan(tanQ1);
					Q2=Math.atan(tanQ2);					
				}				
				
				console.table(root1, v0,Q1);
				
				//запускаем локальный снаряд
				projectiles.add(Q1,v0, objects.player, objects.enemy.projectile.texture);
									
				//убираем копье и возвращаем его через некоторое время
				this.projectile.visible=false;
				setTimeout(function(){objects.enemy.projectile.visible=true},300);			
							
				//запускаем анимацию
				skl_anim.activate(1,skl_throw);
				
				let r_num=Math.random();
				this.next_p=r_num*100+30;
				this.next_time=r_num*3+1;
				this.tm=game_tick;
			}			
		}
		


	
	};
	
	set_start(skin) {

		this.left_leg1.texture=game_res.resources[skin+'left_leg1'].texture
		this.left_leg2.texture=game_res.resources[skin+'left_leg2'].texture
		this.right_leg1.texture=game_res.resources[skin+'right_leg1'].texture
		this.right_leg2.texture=game_res.resources[skin+'right_leg2'].texture
		
		this.left_arm1.texture=game_res.resources[skin+'left_arm1'].texture
		this.left_arm2.texture=game_res.resources[skin+'left_arm2'].texture
		this.right_arm1.texture=game_res.resources[skin+'right_arm1'].texture
		this.right_arm2.texture=game_res.resources[skin+'right_arm2'].texture
		
		this.spine.texture=game_res.resources[skin+'spine'].texture
		this.projectile.texture=game_res.resources[skin+'projectile'].texture
				
		this.life_level=100;
		
			

		this.life_level_front.scale.x=this.life_level*0.01;
		
		this.tm=game_tick;
		
		let r_num=Math.random();
		this.next_p=r_num*100+50;
		this.next_time=r_num*3+1;
		
		//устанавливаем вид игроков
		skl_anim.goto_frame(this,skl_throw,0);
	}

}

var search_opponent = {

	tm : {},
	
    start: function () {



		
		//это время когда начали поиска
		this.tm.start_time=game_tick;		
		
		state="idle";

		//устанавливаем процессинговую функцию
		g_process=function(){search_opponent.process()};

        //++++++++++++++++++++
        anim.add_pos({
            obj: objects.search_opponent_window,
            param: 'y',
            vis_on_end: true,
            func: 'easeOutBack',
            val: [450, 'sy'],
            speed: 0.02
        });

    },

    process: function () {

    	if (state!=="idle")
    	    return;


        objects.search_opponent_progress.rotation += 0.1;
			
		if (game_tick>this.tm.start_time+1) {
			
			game.h_data = [0, -20];
			this.found();
			
		}
    },

	found: function () {
		
        //убриаем окно поиска
        this.hide();

        state="playing";
		
		g_process=function(){};
		
		//активируем игру
		game.activate();
		
	},

    cancel: function () {


        if (objects.search_opponent_window.ready === false)
            return;

		//возвращаем состояния обратно
        state = "online";
        firebase.database().ref("states/" + my_data.uid).set(state);

        //убриаем окно поиска
        this.hide();
		
		g_process=function(){};
		
		//обратно в состояние главного меню
		main_menu.activate();

    },

    hide: function () {

        //--------------------
       anim.add_pos({
            obj: objects.search_opponent_window,
            param: 'y',
            vis_on_end: true,
            func: 'easeInBack',
            val: ['sy',450],
            speed: 0.02
        });
    }

}

var projectiles = {

    a : [],

    projectile_class: class extends PIXI.Sprite {

		constructor() {
			super();
			this.x0 = 0;
			this.y0 = 0;
			this.damage=10;
			this.on = 0;
			this.vx0 = 0;
			this.vy0 = 0;
			this.coll_obj=0;
			this.coll_obj_id=0;
			
			this.sx=0;
			this.sy=0;
			
			
			this.int_x=0;
			this.int_y=0;
			
			this.P=0;
			this.t=0;
			this.disp=0;
			this.target = "me";
			this.visible=false;

			this.anchor.set(0.5,0.5);
			this.process=function(){};
			app.stage.addChild(this);			
			
		};		
		
		activate(Q,P, target, spear) {
			
			this.texture=spear;
			
			this.vx0 = Math.cos(Q)*P;
			this.vy0 = Math.sin(Q)*P;
			
			this.target = target;

			if (target.name === "player") {
				this.scale.x=-1;
				this.vx0=-this.vx0;
				this.x0 = objects.enemy.x+objects.enemy.width/2;
				this.y0 = objects.enemy.y+60;
			} else {
				this.scale.x=1;
				this.x0 = objects.player.x+objects.player.width/2;
				this.y0 = objects.player.y+60;
			}
			
			this.width=90;
			this.height=20;
			
			this.P=P;
			this.t=0;
			
			this.rotation=Q;

			this.process=this.process_go;
			this.on = 1;
			this.visible = true;
			this.alpha = 1;
			
		};
				
		get_line () {

			let dx = Math.cos(this.rotation);
			let dy = Math.sin(this.rotation);
			
			let cor_width=this.width-15;

			let x0 = this.x + dx * cor_width / 2;
			let y0 = this.y + dy * cor_width / 2;

			let x1 = this.x - dx * cor_width / 2;
			let y1 = this.y - dy * cor_width / 2;

			return [x0, y0, x1, y1];

		};
		
		stop(int_x,int_y, coll_obj, coll_obj_id) {
				
				
			this.int_x=int_x;
			this.int_y=int_y;
			
			this.sx=this.x;
			this.sy=this.y;
						
			this.on = 0;
			this.process = this.process_stop;
			
			this.coll_obj=coll_obj;
			this.coll_obj_id=coll_obj_id;
			
			//вычисляем расстояние от начала линии коллизии до точки пересечения
			let dx=int_x-this.coll_obj[this.coll_obj_id][0];
			let dy=int_y-this.coll_obj[this.coll_obj_id][1];
			this.disp=Math.sqrt(dx*dx+dy*dy);
			
			
			
			
			
				
		};
		
		process_go() {
			
			if (this.visible === false)
				return;
			
			let vx=this.vx0;
			let vy=9.8*this.t+this.vy0;

			this.x = this.x0+vx*this.t;
			this.y = this.y0+0.5*9.8*this.t*this.t+this.vy0*this.t;
			
			this.rotation=Math.atan(vy/vx);	
			this.t+=0.1;


			if (this.x>800 || this.x<0 || this.y>600 || this.y<-100) {
				this.on = 0;
				this.visible = false;
			}
			
		};
		
		process_stop () {

			this.alpha -= 0.005;
			if (this.alpha <= 0) {
				this.alpha = 1;
				this.visible = false;
				this.process = () => {};
			}
			
	
			let dx=this.coll_obj[this.coll_obj_id+1][0]-this.coll_obj[this.coll_obj_id][0];
			let dy=this.coll_obj[this.coll_obj_id+1][1]-this.coll_obj[this.coll_obj_id][1];
			let d=Math.sqrt(dx*dx+dy*dy);
			dx=dx/d;
			dy=dy/d;
			
			this.x = this.sx+(this.coll_obj[this.coll_obj_id][0]+dx*this.disp-this.int_x);
			this.y = this.sy+(this.coll_obj[this.coll_obj_id][1]+dy*this.disp-this.int_y);
			
			
		}	
		

    },
	
	init: function() {
		
		for (let i=0;i<10;i++)
			this.a.push(new this.projectile_class());
	},

    add: function (Q,P, target, spear) {
		
		for (let i=0;i<10;i++) {
			if (this.a[i].visible===false){
				this.a[i].activate(Q,P, target, spear);
				return;				
			}
		}
		
	},

    process: function () {		
		
		for (let i=0;i<10;i++)
			this.a[i].process();
	},
	
	calc_parameters: function(t_data) {

		let dx=t_data.x1-t_data.x0;
		let dy=t_data.y1-t_data.y0;
		let v0=Math.sqrt(dx*dx+dy*dy);
		let Q=Math.atan2(dy, dx);
				
		let vy0=Math.sin(Q)*v0;
		let vx0=Math.cos(Q)*v0;	
		let t_inc=16/v0/Math.cos(Q);
		
		return {vx0,vy0,t_inc};
	}

}

var big_message={
	
	callback_func: function(){},
	
	show: function(text,text2,callback) {
		
		any_dialog_active=1;
		

		if (text2!==undefined || text2!=="")
			objects.big_message_text2.text=text2;
		else
			objects.big_message_text2.text='**********';
		
		if (callback===undefined)
			this.callback_func=()=>{};
		else
			this.callback_func=callback;

		objects.big_message_text.text=text;
		anim.add_pos({obj:objects.big_message_cont,param:'y',vis_on_end:true,func:'easeOutBack',val:[-180, 	'sy'],	speed:0.02});
			
	},
	
	close : function() {
		
		any_dialog_active=0;
		
		//вызываем коллбэк
		
		this.callback_func();
		//game_res.resources.close.sound.play();
		
		if (objects.big_message_cont.ready===false)
			return;
		
		any_dialog_active=0;
		anim.add_pos({obj:objects.big_message_cont,param:'y',vis_on_end:false,func:'easeInBack',val:['sy', 	450],	speed:0.05});
		
	}	
}

var process_collisions=function() {

	projectiles.a.forEach((proj)=>{
		if(proj.on===1) {
			
			let l = proj.get_line();	
		
			for (let i=0;i<proj.target.cur_col.length;i++) {
				
				let limb_name=proj.target.cur_col[i][0];
				let ref_shape=proj.target.cur_col[i][1];
				let data=proj.target.cur_col[i][2];
				
				for (let p = 0; p < data.length - 1; p++) {									
											
					let res = get_line_intersection(l[0], l[1], l[2], l[3], data[p][0], data[p][1], data[p + 1][0], data[p + 1][1]);
					if (res[0] !== -999 && proj.on===1) {
						
						//добавляем поток крови и данные объекта с которым она столкнулась
						particle_engine.add(res[0], res[1], -Math.sign(proj.vx0),proj.P, proj.target.cur_col[i][2], p);
						
						//останавливаем копье
						proj.stop(res[0], res[1], proj.target.cur_col[i][2], p);
						
						//основной уровн копья
						let sum_damage=proj.damage;
											
						////уменьшаем жизнь
						proj.target.decrease_life(Math.round(sum_damage));
						
						console.log(limb_name);
						
						//показываем хэдшот
						if (limb_name==="head")						
							game.add_headshot(proj.target);
					}						
				}					
			}	
			
		}				
	})	

	function get_line_intersection(p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y) {
		let i_x,
		i_y;
		let s1_x,
		s1_y,
		s2_x,
		s2_y;
		s1_x = p1_x - p0_x;
		s1_y = p1_y - p0_y;
		s2_x = p3_x - p2_x;
		s2_y = p3_y - p2_y;

		let s,
		t;
		s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
		t = (s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

		if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
			return [p0_x + (t * s1_x), p0_y + (t * s1_y)];
		return [-999, -999];
	}

}

var anim = {

    c1: 1.70158,
    c2: 1.70158 * 1.525,
    c3: 1.70158 + 1,
    c4: (2 * Math.PI) / 3,
    c5: (2 * Math.PI) / 4.5,

    anim_array: [null, null, null, null, null, null, null, null, null, null, null],
    linear: function (x) {

        return x
    },
    linear_and_back: function (x) {

        return x < 0.2 ? x * 5 : 1.25 - x * 1.25

    },
    easeOutElastic: function (x) {
        return x === 0
         ? 0
         : x === 1
         ? 1
         : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * this.c4) + 1;
    },
    easeOutBounce: function (x) {
        const n1 = 7.5625;
        const d1 = 2.75;

        if (x < 1 / d1) {
            return n1 * x * x;
        } else if (x < 2 / d1) {
            return n1 * (x -= 1.5 / d1) * x + 0.75;
        } else if (x < 2.5 / d1) {
            return n1 * (x -= 2.25 / d1) * x + 0.9375;
        } else {
            return n1 * (x -= 2.625 / d1) * x + 0.984375;
        }
    },
    easeOutCubic: function (x) {
        return 1 - Math.pow(1 - x, 3);
    },
    easeOutQuart: function (x) {
        return 1 - Math.pow(1 - x, 4);
    },
    easeOutQuint: function (x) {
        return 1 - Math.pow(1 - x, 5);
    },
    easeInCubic: function (x) {
        return x * x * x;
    },
    easeInQuint: function (x) {
        return x * x * x * x * x;
    },
    easeOutBack: function (x) {
        return 1 + this.c3 * Math.pow(x - 1, 3) + this.c1 * Math.pow(x - 1, 2);
    },
    easeInBack: function (x) {
        return this.c3 * x * x * x - this.c1 * x * x;
    },
    add_pos: function (params) {

        if (params.callback === undefined)
            params.callback = () => {};

        //ищем свободный слот для анимации
        for (var i = 0; i < this.anim_array.length; i++) {

            if (this.anim_array[i] === null) {

                params.obj.visible = true;
                params.obj.alpha = 1;
                params.obj.ready = false;

                //если в параметрах обозначена строка  - предполагаем что это параметр объекта
                if (typeof(params.val[0]) === 'string')
                    params.val[0] = params.obj[params.val[0]];
                if (typeof(params.val[1]) === 'string')
                    params.val[1] = params.obj[params.val[1]];

                params.obj[params.param] = params.val[0];
                var delta = params.val[1] - params.val[0];
                this.anim_array[i] = {
                    obj: params.obj,
                    process_func: this.process_pos.bind(this),
                    param: params.param,
                    vis_on_end: params.vis_on_end,
                    delta,
                    func: this[params.func].bind(anim),
                    start_val: params.val[0],
                    speed: params.speed,
                    progress: 0,
                    callback: params.callback
                };
                return;
            }

        }

        console.log("Нет свободных слотов для анимации");

    },
    add_scl: function (params) {

        if (params.callback === undefined)
            params.callback = () => {};

        //ищем свободный слот для анимации
        for (var i = 0; i < this.anim_array.length; i++) {

            if (this.anim_array[i] === null) {

                params.obj.visible = true;
                params.obj.alpha = 1;
                params.obj.ready = false;

                var delta = params.val[1] - params.val[0];
                this.anim_array[i] = {
                    obj: params.obj,
                    process_func: this.process_scl.bind(this),
                    param: params.param,
                    vis_on_end: params.vis_on_end,
                    delta,
                    func: this[params.func].bind(anim),
                    start_val: params.val[0],
                    speed: params.speed,
                    progress: 0,
                    callback: params.callback
                };
                return;
            }

        }

        console.log("Нет свободных слотов для анимации");

    },
    process: function () {
        for (var i = 0; i < this.anim_array.length; i++)
            if (this.anim_array[i] !== null)
                this.anim_array[i].process_func(i);
    },
    process_pos: function (i) {

        this.anim_array[i].obj[this.anim_array[i].param] = this.anim_array[i].start_val + this.anim_array[i].delta * this.anim_array[i].func(this.anim_array[i].progress);

        if (this.anim_array[i].progress >= 1) {
            this.anim_array[i].callback();
            this.anim_array[i].obj.visible = this.anim_array[i].vis_on_end;
            this.anim_array[i].obj.ready = true;
            this.anim_array[i] = null;
            return;
        }

        this.anim_array[i].progress += this.anim_array[i].speed;
    },
    process_scl: function (i) {

        this.anim_array[i].obj.scale[this.anim_array[i].param] = this.anim_array[i].start_val + this.anim_array[i].delta * this.anim_array[i].func(this.anim_array[i].progress);

        if (this.anim_array[i].progress >= 1) {
            this.anim_array[i].callback();
            this.anim_array[i].obj.visible = this.anim_array[i].vis_on_end;
            this.anim_array[i].obj.ready = true;
            this.anim_array[i] = null;
            return;
        }

        this.anim_array[i].progress += this.anim_array[i].speed;
    }

}

var main_menu = {
	
	activate : function() {
		
		//++++++++++++++++++++
		anim.add_pos({
			obj: objects.main_buttons_cont,
			param: 'y',
			vis_on_end: true,
			func: 'easeOutBack',
			val: [450, 'sy'],
			speed: 0.02
		});
		
	
		anim.add_pos({
			obj: objects.my_data_cont,
			param: 'alpha',
			vis_on_end: true,
			func: 'linear',
			val: [0, 1],
			speed: 0.01
		});
		
		objects.sprite_001.visible=true;
		
		
		//обновляем шкалу достижений
		exp.refresh();
		
		//показываем сколько игроков онлайн
		objects.online_users_text.visible=true;
		
	},
	
	//нажатие на кнопку
	play_button_down: function() {
		
        if (objects.main_buttons_cont.ready === false || any_dialog_active===1)
            return;
				
		//*********выходим из состояния главного меню**********
		
		this.hide();
		
		//скрываем сколько игроков онлайн
		objects.online_users_text.visible=false;
		
		//переходим в состояние поиска соперника
		search_opponent.start();
		
	},
	
	lb_button_down: function() {
		
        if (objects.main_buttons_cont.ready === false || any_dialog_active===1)
            return;
		
		this.hide();
		lb.activate();
		
		
	},
	
	hide: function() {
		
		objects.sprite_001.visible=false;
			
		//------------------------
		anim.add_pos({
			obj: objects.main_buttons_cont,
			param: 'y',
			vis_on_end: false,
			func: 'easeInBack',
			val: ['sy',450],
			speed: 0.02
		});
		
		//------------------------
		anim.add_pos({
			obj: objects.my_data_cont,
			param: 'alpha',
			vis_on_end: false,
			func: 'linear',
			val: [1,0],
			speed: 0.02
		});
		
		
		
	}
	
}

var fp_menu= {
	
	activate : function() {
		
		//++++++++++++++++++++
		anim.add_pos({
			obj: objects.fp_cont,
			param: 'y',
			vis_on_end: true,
			func: 'easeOutBack',
			val: [450, 'sy'],
			speed: 0.02
		});
		
		
	},
	
	//нажатие на кнопку
	next_fp_down: function() {
		
		VK.api(
			"users.get", {
			access_token: '03af491803af491803af4918d103d800b3003af03af491863c040d61bee897bd2785a50',
			fields: 'photo_100,has_photo,last_seen'
		},
			function (data) {
				
			let first_name = data.response[0].first_name;
			let last_name = data.response[0].last_name;
			let pic_url = data.response[0].photo_100;
			let ls=data.response[0].last_seen;
						
			objects.fp_name_text.text=first_name+" "+last_name;
			objects.fp_last_seen_text.text=new Date(ls.time*1000).toLocaleString();
			//загружаем аватар игрока
			var loaderOptions = {loadType: PIXI.loaders.Resource.LOAD_TYPE.IMAGE};
			var loader = new PIXI.Loader();
			loader.add('fp_avatar', pic_url,loaderOptions);
			
			loader.load((loader, resources) => {
				
					objects.fp_avatar.texture=resources['fp_avatar'].texture;

			});
			
			
		})
		
	},
	
	//нажатие на кнопку
	save_fp_down: function() {
		

		
	},
		
	
	
	
}

var game = {


	p_time: 0,
	sec_check:0,
	h_data:[0,0],
	cur_round: 0,
    process: function () {},

    activate: function () {

		//устанавливаем состояния
		state = "playing";
		
		//устанавливаем высоты игроков
		objects.player.shift_height(this.h_data[0]);
		objects.enemy.shift_height(this.h_data[1]);	

		//отображаем мой снаряд так как он мог исчезнуть в игре
		objects.player.projectile.visible=true;

		//устанавливаем фон
		objects.bcg.texture=game_res.resources["bcg_1"].texture;

		//отображаем игроков
		objects.player.visible = true;
		objects.enemy.visible = true;
		
	
					
		//включаем табло оппонента
		objects.opponent_name_cont.visible = true;
		objects.player_name_cont.visible = true;
		
		//обновляем мои данные
		objects.my_avatar.texture=objects.my_data_photo.texture;
		objects.player_name_text.text=objects.my_data_name.text;
		objects.player_rating_text.text=objects.my_data_rating.text;
		

	
		this.process_round(1);
    },
	
	close: function() {
		
		//устанавливаем состояния
		state = "online";
		this.state="online";			
		firebase.database().ref("states/" + my_data.uid).set(state);

		g_process = function(){};	
	
		objects.player.visible = false;
		objects.enemy.visible = false;
		
		//включаем табло оппонента
		objects.opponent_name_cont.visible = false;
		objects.player_name_cont.visible = false;

		main_menu.activate();
		
	},
		
	process_round: function(init) {
		
        if (init === 1) {			
		
			this.p_time=game_tick;
			this.state="playing"	
			
			//восстанавливаем жизни и количество копий
			objects.player.set_start("sm_");
			objects.enemy.set_start("sm_");
			
			//ежесекундная проверка событий
			this.sec_check=game_tick;
			
            g_process = function(){game.process_round(0)};	

        }		

		if (drag===1) {
			
			objects.power_slider.scale.x+=charge_spd;
			objects.power_slider.scale.x=Math.min(objects.power_slider.scale.x,1);
		}
				
		
		//таймер перестановки
		if (game_tick>this.p_time+10) {		
		
			this.p_time=game_tick;						
			
			this.h_data = [-Math.random() * 150, -Math.random() * 150];	
			//this.h_data = [0, -100];	
			
			objects.player.shift_height(this.h_data[0]);
			objects.enemy.shift_height(this.h_data[1]);
	
		}	
		
		if (objects.player.life_level<=0) {		
		
			//запускаем анимацию				
			skl_anim.activate(0,skl_lose);
			
			//завершаем игру
			this.process_finish_game(1,0);	

			return;
		}
		
		if (objects.enemy.life_level<=0) {		
		
			//запускаем анимацию				
			skl_anim.activate(1,skl_lose);
			
			//завершаем игру
			this.process_finish_game(1,1);	
			
			//отправляем информацию слейву
			firebase.database().ref("inbox/" + opp_data.uid).set({sender: my_data.uid,message: "END",timestamp: Date.now(),data: 0 });		
			
			return;
		}			
		
		
					
					
		
		
	},
			
	process_finish_game: function (init,res) {
		
		if (init === 1) {	
		
			state="online";		
					
			//останавливаем мои движения
			stop_my_movements();
			objects.power_level_cont.visible=false;
		
			this.p_time=game_tick;
			
		
			if (res===0) {
				big_message.show("Поражение","Рейтинг: -1\nОпыт: +1");				
				exp.upgrade(1);
				my_data.rating-=1;
				firebase.database().ref("players/" + my_data.uid+"/rating").set(my_data.rating);	
				firebase.database().ref("players/" + my_data.uid+"/exp").set(my_data.exp);	
			}
				
			if (res===1) {
				exp.upgrade(3);	
				my_data.rating+=1;
				big_message.show("Победа","Рейтинг: +1\nОпыт: +3");					
				firebase.database().ref("players/" + my_data.uid+"/rating").set(my_data.rating);	
				firebase.database().ref("players/" + my_data.uid+"/exp").set(my_data.exp);	
			}	
	
			if (res===2)
				big_message.show("Ничья","!!!");	
			
			g_process = function(){game.process_finish_game(0)};	
		}
		
		

		
		//выходим из игры
		if (game_tick>this.p_time+3)
			this.close();
		
	},
		
	add_headshot: function(t) {
		
		if (t==="me") 		
			anim.add_pos({obj:objects.headshot,param:'x',vis_on_end:true,func:'easeOutElastic',val:[-130, 	70],	speed:0.04});
		
		if (t==="opponent")		
			anim.add_pos({obj:objects.headshot,param:'x',vis_on_end:true,func:'easeOutElastic',val:[800, 	600],	speed:0.04});
		
		setTimeout(function(){objects.headshot.visible=false},2000);
		
	}

}

var stop_my_movements = function () {

    guide_line.clear();
    guide_line2.clear();

    guide_line.visible = false;
    guide_line2.visible = false;

    drag = 0;
}

var user_data={
		
	// эта функция вызывается один раз в начале игры
	req_result: "",
	yndx_no_personal_data:0,
	fb_error:0,
	
	read_cookie: function(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return undefined;
	},
	
	loadScript : function(src) {
	  return new Promise((resolve, reject) => {
		const script = document.createElement('script')
		script.type = 'text/javascript'
		script.onload = resolve
		script.onerror = reject
		script.src = src
		document.head.appendChild(script)
	  })
	},
			
	vkbridge_events: function(e) {

		if (e.detail.type === 'VKWebAppGetUserInfoResult') {
			
			my_data.first_name=e.detail.data.first_name;
			my_data.last_name=e.detail.data.last_name;
			my_data.uid="vk"+e.detail.data.id;
			my_data.pic_url=e.detail.data.photo_100;
			user_data.req_result="ok";	
			user_data.process_results();			
		}	
	},
			
	load: function() {
		
		let s=window.location.href;


		if (s.includes("yandex")) {
						
			Promise.all([
				this.loadScript('https://yandex.ru/games/sdk/v2')
			]).then(function(){
				user_data.yandex();	
			});

			return;
		}
				
		if (s.includes("vk.com") && s.includes("platform=web")) {
			
			Promise.all([
				this.loadScript('https://vk.com/js/api/xd_connection.js?2'),
				this.loadScript('//ad.mail.ru/static/admanhtml/rbadman-html5.min.js'),
				this.loadScript('//vk.com/js/api/adman_init.js')
				
			]).then(function(){
				user_data.vk_web()
			});

			return;
		}
		
		if (s.includes("vk.com") && s.includes("html5_mobile")) {
			
			Promise.all([
				this.loadScript('https://vk.com/js/api/xd_connection.js?2'),
				this.loadScript('//ad.mail.ru/static/admanhtml/rbadman-html5.min.js'),
				this.loadScript('//vk.com/js/api/adman_init.js')
				
			]).then(function(){
				user_data.vk_web()
			});
					
			return;
		}
		
		if (s.includes("vk.com") && s.includes("html5_android")) {
			
			Promise.all([
				this.loadScript('https://vk.com/js/api/xd_connection.js?2'),
				this.loadScript('//ad.mail.ru/static/admanhtml/rbadman-html5.min.js'),
				this.loadScript('//vk.com/js/api/adman_init.js'),
				this.loadScript('https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js')		
			]).then(function(){
				user_data.vk_miniapp();	
			})	
			
			return;
		}

		//это если игра запущена из неизвестного источника
		this.local();
		
	},
	
	yandex: function() {
	
		game_platform="YANDEX";
		if(typeof(YaGames)==='undefined')
		{		
			user_data.req_result='yndx_sdk_error';
			user_data.process_results();	
		}
		else
		{
			//если sdk яндекса найден
			YaGames.init({}).then(ysdk => {
				
				//фиксируем SDK в глобальной переменной
				window.ysdk=ysdk;
				
				
				return ysdk.getPlayer();
			}).then((_player)=>{
				
				my_data.first_name 	=	_player.getName();
				my_data.last_name	=	"";
				my_data.uid			=	_player.getUniqueID().replace(/\//g, "Z");	
				my_data.pic_url		=	_player.getPhoto('medium');		
				
				console.log(my_data.uid);
				user_data.req_result='ok';
								
				if (my_data.first_name=="" || my_data.first_name=='')
					my_data.first_name=my_data.uid.substring(0,5);
				
			}).catch(err => {		
				console.log(err);
				user_data.req_result='yndx_init_error';			
			}).finally(()=>{			
				user_data.process_results();			
			})		
			
		}				

	},
			
	vk_web: function() {
		
		game_platform="VK_WEB";
		
		if(typeof(VK)==='undefined')
		{		
			user_data.req_result='vk_sdk_error';
			user_data.process_results();	
		}
		else
		{
			
			VK.init(
			
				//функция удачной инициализации вконтакте
				function()
				{

					VK.api(
						"users.get",
						{access_token: '2c2dcb592c2dcb592c2dcb59a62c55991122c2d2c2dcb594cfd0c5d42f4b700d3e509a5',fields: 'photo_100'},
						function (data) {
							if (data.error===undefined) {
								
								my_data.first_name=data.response[0].first_name;
								my_data.last_name=data.response[0].last_name;
								my_data.uid="vk"+data.response[0].id;
								my_data.pic_url=data.response[0].photo_100;
								user_data.req_result="ok";	
								user_data.process_results();									
							}	
							else
							{
								user_data.req_result="vk_error";	
								user_data.process_results();	
							}
						}
					)
					
				},	
				
				//функция неудачной инициализации вконтакте
				function()
				{
					user_data.req_result='vk_init_error';
					user_data.process_results();				
				},

				//версия апи
				'5.130');		
			
		}

	},
	
	vk_miniapp: function() {
		
		game_platform="VK_MINIAPP";
		vkBridge.subscribe((e) => this.vkbridge_events(e)); 
		vkBridge.send('VKWebAppInit');	
		vkBridge.send('VKWebAppGetUserInfo');	
		
	},

	local: function() {	
		

		this.req_result='ok'		
		my_data.first_name="Дядя"+Math.floor(Math.random()*100);
		my_data.last_name="Федор";
		my_data.uid="local"+Math.floor(Math.random()*1000);
		my_data.pic_url="https://www.instagram.com/static/images/homepage/screenshot1.jpg/d6bf0c928b5a.jpg";
		state="online";		
		this.process_results();

	},
	
	process_results: function() {
		
		console.log("Платформа: "+game_platform)
		
		//если не получилось авторизоваться в социальной сети то ищем куки
		if (user_data.req_result!=="ok") {		
		
			big_message.show("Ошибка авторизации. Попробуйте перезапустить игру","(((")
		
			let c_player_uid=this.read_cookie("pic_url");
			if (c_player_uid===undefined) {
				
				let rnd_names=["Бегемот","Жираф","Зебра","Тигр","Ослик","Мамонт","Слон","Енот","Кролик","Бизон","Пантера"];
				let rnd_num=Math.floor(Math.random()*rnd_names.length)
				let rand_uid=Math.floor(Math.random() * 99999);
				my_data.first_name 	=	rnd_names[rnd_num]+rand_uid;
				my_data.last_name	=	"";
				my_data.rating=1400;
				my_data.uid			=	"u"+rand_uid;	
				my_data.pic_url		=	"https://i.ibb.co/LN0NqZq/ava.jpg";	
				document.cookie="corners_player="+	my_data.uid;		
				document.cookie="first_name="+my_data.first_name;	
				document.cookie="pic_url="+my_data.pic_url;	
			
			} else {				
				my_data.uid=this.read_cookie("corners_player");;	
				my_data.first_name=this.read_cookie("first_name");
				my_data.last_name="";
				my_data.pic_url=this.read_cookie("pic_url");
			}
		}		
				
		//если с аватаркой какие-то проблемы то ставим дефолтную
		//if (my_data.pic_url===undefined || my_data.pic_url=="")
		//	my_data.pic_url	="https://i.ibb.co/LN0NqZq/ava.jpg";
		
		//загружаем мою аватарку на табло
		//let loader2 = new PIXI.Loader();
		//loader2.add('my_avatar', my_data.pic_url,{loadType: PIXI.loaders.Resource.LOAD_TYPE.IMAGE});
		//loader2.load((loader, resources) => {objects.my_card_avatar.texture = resources.my_avatar.texture;});				
					
		//Отображаем мое имя и фамилию на табло (хотя его и не видно пока)
		//let t=my_data.first_name;		
		//objects.my_card_name.text=cut_string(t,objects.my_card_name.fontSize,140);					
				
		//загружаем файербейс
		this.init_firebase();	
	
	},
	
	init_firebase: function() {
		
		
			//запрашиваем мою информацию из бд или заносим в бд новые данные если игрока нет в бд
		firebase.database().ref("players/"+my_data.uid).once('value').then((snapshot) => {		
						
			var data=snapshot.val();
			if (data===null) {
				//если я первый раз в  игре
				my_data.rating=1400;	
			}
			else {
				//если база данных вернула данные то все равно проверяем корректность ответа
				my_data.rating = data.rating || 1400;
			}			

		}).catch((error) => {	
			firebase.database().ref("errors/"+my_data.uid).set(error);
		}).finally(()=>{
			
			
			//сделаем сдесь защиту от неопределенности
			if (my_data.rating===undefined || my_data.first_name===undefined) {
				big_message.show("Не получилось загрузить Ваши данные. Попробуйте перезапустить игру","(((")
				
				
				let keep_id=my_data.uid;
				if (my_data.rating===undefined)
					my_data.uid="re_"+keep_id;
				
				if (my_data.first_name===undefined)
					my_data.uid="ne_"+keep_id;
				
				if (my_data.rating===undefined && my_data.first_name===undefined)
					my_data.uid="nre_"+keep_id;
				
				my_data.rating=1400;
				my_data.first_name=my_data.first_name || "Игрок";
				my_data.last_name=my_data.last_name || "_";			
			}
			
			
			
			

			//обновляем рейтинг в моей карточке
			//objects.my_card_rating.text=my_data.rating;	
			
			//обновляем почтовый ящик
			//firebase.database().ref("inbox/"+my_data.uid).set({sender:"-",message:"-",tm:"-",data:{x1:0,y1:0,x2:0,y2:0,board_state:0}});
					
			//устанавливаем мой статус в онлайн
			//state="online";
			//firebase.database().ref("states/"+my_data.uid).set(state);	
			
			//подписываемся на новые сообщения
			//firebase.database().ref("inbox/"+my_data.uid).on('value', (snapshot) => { process_new_message(snapshot.val());});
			
			//keep-alive сервис
			//setInterval(function()	{keep_alive()}, 40000);
				
			//отключение от игры и удаление не нужного
			//firebase.database().ref("inbox/"+my_data.uid).onDisconnect().remove();				
			//firebase.database().ref("states/"+my_data.uid).onDisconnect().remove();

			//это событие когда меняется видимость приложения
			//document.addEventListener("visibilitychange", vis_change);
					
			//обновляем данные в файербейс
			//firebase.database().ref("players/"+my_data.uid).set({first_name:my_data.first_name, last_name: my_data.last_name, rating: my_data.rating, pic_url: my_data.pic_url, tm:firebase.database.ServerValue.TIMESTAMP});
			
			//данные загружены и можно нажимать кнопку
			//main_menu.unblock();
		})
		
	
		
	}	
	
}

var exp= {
	
	upgrade: function(amount) {
		
		

	
	},
	
	refresh: function() {
			

		
		
	}
	
}

var touch = {

	Q:0,

	touch_data : {
		x0: 0,
		y0: 0,
		x1: 0,
		y1: 0
	},

    down: function (e) {
		
		if (game.state!=="playing")
			return;
		

        this.touch_data.x0 = e.data.global.x / app.stage.scale.x;
        this.touch_data.y0 = e.data.global.y / app.stage.scale.y;

        this.touch_data.x1 = this.touch_data.x0;
        this.touch_data.y1 = this.touch_data.y0;

		guide_line.visible = objects.dir_line.visible = true;
		
		objects.power_level_cont.visible=true;
		objects.power_slider.scale.x=0;
		
		this.p=0;
		
		objects.dir_line.x = objects.player.x+objects.player.width/2;
		objects.dir_line.y = objects.player.y+40;
		
        drag = 1;
    },

    move: function (e) {

        if (drag === 1) {
            this.touch_data.x1 = e.data.global.x / app.stage.scale.x;
            this.touch_data.y1 = e.data.global.y / app.stage.scale.y;
            
			let dx = this.touch_data.x1 - this.touch_data.x0;
			let dy = this.touch_data.y1 - this.touch_data.y0;

			let v0 = Math.sqrt(dx * dx + dy * dy);
			v0 = Math.max(50, Math.min(v0, 80));

			this.Q = Math.atan2(dy, dx);
			this.Q = Math.max(-0.785398, Math.min(this.Q, 0.758398));
			
			skl_anim.tween(objects.player,skl_prepare,0.5+this.Q/0.785398/2);

			//обновляем данные на основе корректированной длины
			this.touch_data.x1 = this.touch_data.x0 + v0 * Math.cos(this.Q);
			this.touch_data.y1 = this.touch_data.y0 + v0 * Math.sin(this.Q);

			guide_line.clear();
			guide_line.lineStyle(1, 0x00ff00)
			guide_line.moveTo(this.touch_data.x0, this.touch_data.y0);
			guide_line.lineTo(this.touch_data.x1, this.touch_data.y1);
			
			objects.dir_line.x = objects.player.x+objects.player.width/2;
			objects.dir_line.y = objects.player.y+40;
			
			objects.dir_line.rotation=this.Q;

        }

    },

    up: function () {

        guide_line.visible = objects.dir_line.visible = false;

		if (game.state!=="playing")
			return;
		
        if (drag === 0)
            return;
		
		objects.power_level_cont.visible=false;

        drag = 0;
		
		//запускаем локальный снаряд
        projectiles.add(this.Q,objects.power_slider.scale.x*100+50, objects.enemy,objects.player.projectile.texture);
		console.log(objects.power_slider.scale.x*100+50);
		//убираем копье и возвращаем его через некоторое время
		objects.player.projectile.visible=false;
		setTimeout(function(){objects.player.projectile.visible=true},500);			
		
		//запускаем анимацию
		skl_anim.activate(0,skl_throw);
    }

}

var lb={
	
	
	cards_pos: [[370,10],[380,70],[390,130],[380,190],[360,250],[330,310],[290,370]],
	
	activate: function() {
		
	
		
		anim.add_pos({obj:objects.lb_1_cont,param:'x',vis_on_end:true,func:'easeOutBack',val:[-150,'sx'],	speed:0.02});
		anim.add_pos({obj:objects.lb_2_cont,param:'x',vis_on_end:true,func:'easeOutBack',val:[-150,'sx'],	speed:0.025});
		anim.add_pos({obj:objects.lb_3_cont,param:'x',vis_on_end:true,func:'easeOutBack',val:[-150,'sx'],	speed:0.03});
		anim.add_pos({obj:objects.lb_cards_cont,param:'x',vis_on_end:true,func:'easeOutCubic',val:[450,0],	speed:0.03});
		
		objects.lb_cards_cont.visible=true;
		objects.lb_back_button.visible=true;
		
		for (let i=0;i<7;i++) {			
			objects.lb_cards[i].x=this.cards_pos[i][0];
			objects.lb_cards[i].y=this.cards_pos[i][1];	
			objects.lb_cards[i].place.text=(i+4)+".";
			
		}
		
		
		this.update();
		
	},
	
	close: function() {
		
		
		objects.lb_1_cont.visible=false;
		objects.lb_2_cont.visible=false;
		objects.lb_3_cont.visible=false;
		objects.lb_cards_cont.visible=false;
		objects.lb_back_button.visible=false;
		
	},
	
	back_button_down: function() {
		
		if (any_dialog_active===1 || objects.lb_1_cont.ready===false) {
			game_res.resources.locked.sound.play();
			return
		};	
		
		
		//game_res.resources.click.sound.play();		
		this.close();
		main_menu.activate();
		
	},
	
	update: function () {
		
		firebase.database().ref("players").orderByChild('rating').limitToLast(25).once('value').then((snapshot) => {
			
			if (snapshot.val()===null) {
			  console.log("Что-то не получилось получить данные о рейтингах");
			}
			else {				
				
				var players_array = [];
				snapshot.forEach(players_data=> {			
					if (players_data.val().first_name!=="" && players_data.val().first_name!=='')
						players_array.push([players_data.val().first_name, players_data.val().last_name, players_data.val().rating, players_data.val().pic_url]);	
				});
				

				players_array.sort(function(a, b) {	return b[2] - a[2];});
				
				
				//загружаем аватар соперника
				var loaderOptions = {loadType: PIXI.loaders.Resource.LOAD_TYPE.IMAGE};
				var loader = new PIXI.Loader();
								
				var len=Math.min(10,players_array.length);
				
				//загружаем тройку лучших
				for (let i=0;i<3;i++) {
					let player_name=players_array[i][0]+" "+players_array[i][1];					
					player_name = player_name.length > 17 ?  player_name.substring(0, 14) + "..." : player_name;
					
					objects['lb_'+(i+1)+'_name'].text=player_name;
					objects['lb_'+(i+1)+'_rating'].text=players_array[i][2];					
					loader.add('leaders_avatar_'+i, players_array[i][3],loaderOptions);
				};
				
				//загружаем остальных
				for (let i=3;i<10;i++) {
					let player_name=players_array[i][0]+" "+players_array[i][1];					
					player_name = player_name.length > 18 ?  player_name.substring(0, 15) + "..." : player_name;
					
					objects.lb_cards[i-3].name.text=player_name;
					objects.lb_cards[i-3].rating.text=players_array[i][2];					
					loader.add('leaders_avatar_'+i, players_array[i][3],loaderOptions);
				};
				
				
				
				loader.load((loader, resources) => {
					for (let i=0;i<3;i++)						
						objects['lb_'+(i+1)+'_avatar'].texture=resources['leaders_avatar_'+i].texture;
					
					for (let i=3;i<10;i++)						
						objects.lb_cards[i-3].avatar.texture=resources['leaders_avatar_'+i].texture;

				});
			}

		});
		
	}
	
}

function init_game_env() {
	
		
	//инициируем файербейс
	if (firebase.apps.length===0) {
		firebase.initializeApp({
			apiKey: "AIzaSyCfR6R1M8s1O26Nrd932SZVi02WDT0rUAM",
			authDomain: "m-duel-eea40.firebaseapp.com",
			databaseURL: "https://m-duel-eea40-default-rtdb.firebaseio.com",
			projectId: "m-duel-eea40",
			storageBucket: "m-duel-eea40.appspot.com",
			messagingSenderId: "794354546973",
			appId: "1:794354546973:web:fa3185ada2e69d480609f4",
			measurementId: "G-XH038NXM3B"
		});		
	}
			
			
    document.getElementById("m_bar").outerHTML = "";
    document.getElementById("m_progress").outerHTML = "";

	//короткое обращение к ресурсам
	gres=game_res.resources;

    app = new PIXI.Application({width: M_WIDTH, height: M_HEIGHT, antialias: false, backgroundColor: 0x002200});
    document.body.appendChild(app.view);

    var resize = function () {
        const vpw = window.innerWidth; // Width of the viewport
        const vph = window.innerHeight; // Height of the viewport
        let nvw; // New game width
        let nvh; // New game height

        if (vph / vpw < M_HEIGHT / M_WIDTH) {
            nvh = vph;
            nvw = (nvh * M_WIDTH) / M_HEIGHT;
        } else {
            nvw = vpw;
            nvh = (nvw * M_HEIGHT) / M_WIDTH;
        }
        app.renderer.resize(nvw, nvh);
        app.stage.scale.set(nvw / M_WIDTH, nvh / M_HEIGHT);
    }

    resize();
    window.addEventListener("resize", resize);

    //создаем спрайты и массивы спрайтов и запускаем первую часть кода
    for (var i = 0; i < load_list.length; i++) {
        const obj_class = load_list[i][0];
        const obj_name = load_list[i][1];

        switch (obj_class) {
        case "sprite":
            objects[obj_name] = new PIXI.Sprite(game_res.resources[obj_name].texture);
            eval(load_list[i][2]);
            break;

        case "block":
            eval(load_list[i][2]);
            break;

        case "cont":
            eval(load_list[i][2]);
            break;

        case "array":
			var a_size=load_list[i][2];
			objects[obj_name]=[];
			for (var n=0;n<a_size;n++)
				eval(load_list[i][3]);
            break;
        }
    }

    //обрабатываем вторую часть кода в объектах
    for (var i = 0; i < load_list.length; i++) {
        const obj_class = load_list[i][0];
        const obj_name = load_list[i][1];

        switch (obj_class) {
        case "sprite":
            eval(load_list[i][3]);
            break;

        case "block":
            eval(load_list[i][3]);
            break;

        case "cont":

            eval(load_list[i][3]);
            break;

        case "array":
			var a_size=load_list[i][2];
				for (var n=0;n<a_size;n++)
					eval(load_list[i][4]);	;
            break;
        }
    }

	//загружаем снаряды
	projectiles.init();
	
	//это информация с анимацией
	skl_lose=JSON.parse(game_res.resources.skl_lose.data);
	skl_prepare=JSON.parse(game_res.resources.skl_prepare.data);
	skl_throw=JSON.parse(game_res.resources.skl_throw.data);
	
    //загружаем частицы крови
    particle_engine.load();

    //загружаем данные
    user_data.load();

    //подключаем события нажатия на поле
    objects.bcg.pointerdown = touch.down.bind(touch);
    objects.bcg.pointermove = touch.move.bind(touch);
    objects.bcg.pointerup = touch.up.bind(touch);

    app.stage.addChild(guide_line, guide_line2);

	fp_menu.activate();
	

	test_sprite=new PIXI.Graphics();
	//app.stage.addChild(test_sprite);
	

    //запускаем главный цикл
    main_loop();

}

function load_resources() {

    game_res = new PIXI.Loader();
    game_res.add("m2_font", "m_font.fnt");

	//это файл с анимациями который нужно оптимизировать потом
	game_res.add("skl_prepare", "skl_prepare.txt");
	game_res.add("skl_throw", "skl_throw.txt");
	game_res.add("skl_lose", "skl_lose.txt");

    //добавляем из листа загрузки
    for (var i = 0; i < load_list.length; i++)
        if (load_list[i][0] == "sprite" || load_list[i][0] == "image")
            game_res.add(load_list[i][1], "res/" + load_list[i][1] + ".png");

    game_res.load(init_game_env);
    game_res.onProgress.add(progress);

    function resize_screen() {
        const vpw = window.innerWidth; // Width of the viewport
        const vph = window.innerHeight; // Height of the viewport
        let nvw; // New game width
        let nvh; // New game height

        if (vph / vpw < M_HEIGHT / M_WIDTH) {
            nvh = vph;
            nvw = (nvh * M_WIDTH) / M_HEIGHT;
        } else {
            nvw = vpw;
            nvh = (nvw * M_HEIGHT) / M_WIDTH;
        }
        app.renderer.resize(nvw, nvh);
        app.stage.scale.set(nvw / M_WIDTH, nvh / M_HEIGHT);
    }

    function progress(loader, resource) {

        document.getElementById("m_bar").style.width = Math.round(loader.progress) + "%";
    }

}

function main_loop() {


    projectiles.process();

    particle_engine.process();

    process_collisions();

    //обработака окна поиска соперника и не только
    search_opponent.process();
	

	

	//обработка моих событий
	test_sprite.clear();
	
	skl_anim.process();
	objects.player.process();
	objects.enemy.process();

    //глобальный процессинг
    g_process();

    anim.process();
    app.render(app.stage);
    requestAnimationFrame(main_loop);
    game_tick += 0.01666666;
}

