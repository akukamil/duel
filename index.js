var M_WIDTH = 800, M_HEIGHT = 450;
var app, game_res, gres, objects = {}, my_data = {}, opp_data = {};
var g_process = () => {};

var any_dialog_active = 0, net_play = 0, game_platform="";;

var guide_line = new PIXI.Graphics();
var guide_line2 = new PIXI.Graphics();
var drag = 0, game_tick = 0, state = "";
var skl_prepare, skl_throw, skl_lose;
var charge_spd=0.005;
var test_sprite,fire_sprite;
var skins_powers=[['s0_',3,0,0,3,0],['bm_',3,0,0,3,10],['bs_',4,1,1,4,20],['ff_',4,1,2,4,30],['gl_',5,2,3,5,40],['sm_',6,3,4,6,50]];

test_mp=[[0,,0,,,,,],[0.02,,5,,,,,],[0.04,,10,,,,,],[0.06,,15,,,,,],[0.08,,20,,,,,],[0.1,,25,,,,,],[0.12,,30,,,,,],[0.14,,35,,,,,],[0.16,,40,,,,,],[0.18,,45,,,,,],[0.2,,50,,,,,],[6,,45,,,,,],[6.02,,40,,,,,],[6.04,,35,,,,,],[6.06,,30,,,,,],[6.08,,25,,,,,],[6.1,,20,,,,,],[6.12,,15,,,,,],[6.14,,10,,,,,],[6.16,,5,,,,,],[6.18,,0,,,,,]]

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
					prtcl.scale.x = prtcl.scale.y = 0.2;
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

					item.scale.x += 0.03;
					item.scale.y += 0.03;
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
			
	slots: [
		{cont: 'player', source: 0,	pos:0,	time:0,	speed:0, on:0},
		{cont: 'enemy', source: 0,	pos:0,	time:0,	speed:0, on:0},
		{cont: 'start_player', source: 0,	pos:0,	time:0,	speed:0, on:0},
		{cont: 'shop_player', source: 0,	pos:0,	time:0,	speed:0, on:0}
	],
	
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
				
				objects[p.cont]['zz_'+s].x=p.source[s][p.pos][0];
				objects[p.cont]['zz_'+s].y=p.source[s][p.pos][1];
				objects[p.cont]['zz_'+s].rotation=p.source[s][p.pos][2];
				
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
			
			cont['zz_'+s].x=cont[s].x;
			cont['zz_'+s].y=cont[s].y;
			cont['zz_'+s].rotation=cont[s].rotation;
			
		}
		
	},
	
	goto_frame: function(cont, source, frame_id) {
		
		for (var s in source) {
			
			cont[s].x=source[s][frame_id][0];
			cont[s].y=source[s][frame_id][1];
			cont[s].rotation=source[s][frame_id][2];
			
			cont['zz_'+s].x=cont[s].x;
			cont['zz_'+s].y=cont[s].y;
			cont['zz_'+s].rotation=cont[s].rotation;
			
		}				
	}			
}   

class player_class extends PIXI.Container{
	
	constructor(name) {
		
		super();
		
		this.frozen=0;
		this.frozen_start=0;
		
		//это возможности
		this.powers={'block':3,'freeze':4,'fire':2};
				
		this.projectile_power='none';
		
		this.skin_id=0;
		
		this.name=name;
		
		
		
		
		
		this.zz_spine=new PIXI.Sprite(gres.zz_spine.texture); this.zz_spine.width=40;	this.zz_spine.height=80;	this.zz_spine.anchor.set(0.5,0.5);
		
		this.zz_left_arm1=new PIXI.Sprite(gres.zz_left_arm1.texture);	this.zz_left_arm1.width=40;	this.zz_left_arm1.height=20;	this.zz_left_arm1.anchor.set(0.5,0.5);
		this.zz_left_arm2=new PIXI.Sprite(gres.zz_left_arm2.texture);	this.zz_left_arm2.width=40;	this.zz_left_arm2.height=20;	this.zz_left_arm2.anchor.set(0.5,0.5);
		this.zz_right_arm1=new PIXI.Sprite(gres.zz_right_arm1.texture);	this.zz_right_arm1.width=40;	this.zz_right_arm1.height=20;	this.zz_right_arm1.anchor.set(0.5,0.5);
		this.zz_right_arm2=new PIXI.Sprite(gres.zz_right_arm2.texture);	this.zz_right_arm2.width=40;	this.zz_right_arm2.height=20;	this.zz_right_arm2.anchor.set(0.5,0.5);
		
		this.zz_left_leg1=new PIXI.Sprite(gres.zz_left_leg1.texture);	this.zz_left_leg1.width=40;	this.zz_left_leg1.height=20;	this.zz_left_leg1.anchor.set(0.5,0.5);
		this.zz_left_leg2=new PIXI.Sprite(gres.zz_left_leg2.texture);	this.zz_left_leg2.width=40;	this.zz_left_leg2.height=20;	this.zz_left_leg2.anchor.set(0.5,0.5);
		this.zz_right_leg1=new PIXI.Sprite(gres.zz_right_leg1.texture);	this.zz_right_leg1.width=40;	this.zz_right_leg1.height=20;	this.zz_right_leg1.anchor.set(0.5,0.5);
		this.zz_right_leg2=new PIXI.Sprite(gres.zz_right_leg2.texture);	this.zz_right_leg2.width=40;	this.zz_right_leg2.height=20;	this.zz_right_leg2.anchor.set(0.5,0.5);
		this.zz_projectile=new PIXI.Sprite(gres.zz_projectile.texture);	this.zz_projectile.width=90;	this.zz_projectile.height=20;	this.zz_projectile.anchor.set(0.5,0.5);
		
		
		this.spine=new PIXI.Sprite(); this.spine.width=40;	this.spine.height=80;	this.spine.anchor.set(0.5,0.5);
		
		this.left_arm1=new PIXI.Sprite();	this.left_arm1.width=40;	this.left_arm1.height=20;	this.left_arm1.anchor.set(0.5,0.5);
		this.left_arm2=new PIXI.Sprite();	this.left_arm2.width=40;	this.left_arm2.height=20;	this.left_arm2.anchor.set(0.5,0.5);
		this.right_arm1=new PIXI.Sprite();	this.right_arm1.width=40;	this.right_arm1.height=20;	this.right_arm1.anchor.set(0.5,0.5);
		this.right_arm2=new PIXI.Sprite();	this.right_arm2.width=40;	this.right_arm2.height=20;	this.right_arm2.anchor.set(0.5,0.5);
		
		this.left_leg1=new PIXI.Sprite();	this.left_leg1.width=40;	this.left_leg1.height=20;	this.left_leg1.anchor.set(0.5,0.5);
		this.left_leg2=new PIXI.Sprite();	this.left_leg2.width=40;	this.left_leg2.height=20;	this.left_leg2.anchor.set(0.5,0.5);
		this.right_leg1=new PIXI.Sprite();	this.right_leg1.width=40;	this.right_leg1.height=20;	this.right_leg1.anchor.set(0.5,0.5);
		this.right_leg2=new PIXI.Sprite();	this.right_leg2.width=40;	this.right_leg2.height=20;	this.right_leg2.anchor.set(0.5,0.5);
		
		this.projectile_bcg=new PIXI.Sprite();	this.projectile_bcg.width=90;	this.projectile_bcg.height=20;	this.projectile_bcg.anchor.set(0.5,0.5);
		this.projectile_2=new PIXI.Sprite();	this.projectile_2.width=90;	this.projectile_2.height=20;	this.projectile_2.anchor.set(0.5,0.5);
		
		this.projectile=new PIXI.Container();
		this.projectile.addChild(this.projectile_bcg,this.projectile_2);
					
				
		this.stand=new PIXI.Sprite();
		this.stand.x=-20;
		this.stand.y=135;		
		this.stand.width=200;
		this.stand.height=640;
		
		
		//уровень жизни
		this.life_level_bcg=new PIXI.Sprite(game_res.resources.life_level_bcg.texture);
		this.life_level_bcg.x=10;
		this.life_level_frame=new PIXI.Sprite(game_res.resources.life_level_frame.texture);
		this.life_level_frame.x=10;
		this.life_level_front=new PIXI.Sprite(game_res.resources.life_level_front.texture);		
		this.life_level_front.x=20;
		
		//блок сфера
		this.block=new PIXI.Sprite(game_res.resources.block.texture);
		this.block.x=80;
		this.block.y=100;	
		this.block.width=200;	this.block.height=200;	this.block.anchor.set(0.5,0.5);
		this.block.visible=false;
		this.block_start=0;
		
		//огонь	
		this.on_fire=0;
		this.on_fire_start=0;
		let tex_arr = [];
		for (var i = 0; i < 32; i++)
			tex_arr.push(gres["fire"+i].texture);
		this.fire=new PIXI.AnimatedSprite(tex_arr);
		this.fire.anchor.set(0.5,1);
		this.fire.x=90;
		this.fire.y=160;
		this.fire.visible=false;

				
		this.addChild(
		
		this.zz_left_arm1,
		this.zz_left_arm2,
		this.zz_right_arm1,
		this.zz_right_arm2,
		this.zz_left_leg1,
		this.zz_left_leg2,
		this.zz_right_leg1,
		this.zz_right_leg2,
		this.zz_spine,	
		this.zz_projectile,	
		this.left_arm1,
		this.left_arm2,
		this.right_arm1,
		this.right_arm2,
		this.left_leg1,
		this.left_leg2,
		this.right_leg1,
		this.right_leg2,
		this.spine,
		this.stand,
		this.projectile,
		this.life_level_bcg,
		this.life_level_front,
		this.life_level_frame,
		this.fire,
		this.block);
		
		this.base_col=JSON.parse(JSON.stringify(col_data));		
		this.cur_col=JSON.parse(JSON.stringify(col_data));			
		
		this.tm=0;
		this.next_v=100;
		this.mext_q=0.5;
		this.next_time=0;
		
		this.life_level=100;

	};
	
	activate_block() {
				
		anim.add_pos({obj: this.block,	param: 'alpha',	vis_on_end: true,	func: 'linear',	val: [0, 1],	speed: 0.1	});		
		this.block_start=game_tick;
		
	}
	
	set_projectile_power(t) {
		
		t==='none'&&(this.projectile_bcg.texture=null);
		t==='freeze'&&(this.projectile_bcg.texture=gres.projectile_freeze.texture);
		t==='fire'&&(this.projectile_bcg.texture=gres.projectile_fire.texture);
		this.projectile_power=t;
	}
	
    shift_height(h_dist) {
        anim.add_pos({obj: this, param: 'y',  vis_on_end: true,  func: 'easeOutBack', val: ['y', this.sy + h_dist], speed: 0.02 });
    };
	
	calc_next_fire() {
		
		//let v0=this.next_p;
		let x0 = objects.enemy.x+objects.enemy.width/2;
		let y0 = objects.enemy.y+50;

		let x1 = objects.player.x+objects.player.width/2;
		let y1 = objects.player.y+65;
		
		let dx=x0-x1;
		let dh=y1-y0;
		
		//считаем параметры следующего снаряда
		let Q1= Math.atan2(dh, dx);					
		let Q=Q1-0.7;
		let v1=(x0-x1)/Math.cos(Q);
		let v2=0.5*9.8/(dh-Math.tan(Q)*dx)
		let v0=v1*Math.sqrt(v2);
		let dispersion=10;
		console.log(v0);
		v0=v0+Math.random()*dispersion-dispersion*0.5;				
		
		this.next_q=Q;
		this.next_v=v0
		this.next_time=game_tick+v0/30;
		
	};
		
	decrease_life(val) {
		
		let new_lev=this.life_level-val;
		new_lev=Math.max(0,new_lev);	
		this.life_level=new_lev;
		this.life_level_front.scale.x=this.life_level*0.01;
	};
	
	make_frozen() {
					
		
		this.frozen=1;
		this.frozen_start=game_tick;	
		
		if (this.name==='player') {
			touch.stop();
			skl_anim.slots[0].on=0;
		} else {
			
			skl_anim.slots[1].on=0;
		}
		
		this.set_skin_by_prefix('s1_');		
	}
	
	make_on_fire() {
		
		this.on_fire=1;
		this.on_fire_start=game_tick;
		this.fire.play();
		this.fire.visible=true;
		
	}
	
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
		
		//обрабатываем события замороженного игрока
		if (this.frozen===1) {				
			if (game_tick-this.frozen_start>5){
				this.frozen=0;
				this.set_skin_by_id();
			}
			return;
		};
		
		//обрабатываем события подожженного игрока
		if (this.on_fire===1) {

			this.decrease_life(0.1);
			if (game_tick-this.on_fire_start>5){
				this.on_fire=0;				
				this.fire.visible=false;
			}
		};
		
		//обрабатываем время блока
		if (this.block.visible===true && this.block.ready===true) {
			if (game_tick>this.block_start+2) {
				anim.add_pos({obj: this.block,	param: 'alpha',	vis_on_end: false,	func: 'linear',	val: [1, 0],	speed: 0.1	});
			}	
			
			this.block.rotation+=0.1;
		}
				
		//для оппонента обновляем дополнительные процессы
		if(this.scale.x===-1) {
						
			if (game_tick>this.next_time) {
								
				//запускаем локальный снаряд
				let r_num=~~(Math.random()*3);
				let p_t='none';
				
				if (r_num===1 && this.powers.freeze>0) {					
					p_t='freeze';
					this.powers.freeze--;					
				}
				
				if (r_num===2 && this.powers.fire>0) {					
					p_t='fire';
					this.powers.fire--;					
				}
				
				projectiles.add(this.next_q,this.next_v, objects.player, objects.enemy.projectile_2.texture, p_t);
			
				//сразу просчитываем следующий снаряд
				this.calc_next_fire();
			
				//убираем копье и возвращаем его через некоторое время
				objects.enemy.projectile.visible=objects.enemy.zz_projectile.visible=false;
				setTimeout(function(){objects.enemy.projectile.visible=objects.enemy.zz_projectile.visible=true},700);			
							
				//запускаем анимацию
				skl_anim.activate(1,skl_throw);
				

			}			
		}
	};
		
	set_skin_by_id(id) {
		
		let skin_prefix=""
		if (id===undefined) {
			skin_prefix=skins_powers[this.skin_id][0];		
		}else {
			this.skin_id=id;
			skin_prefix=skins_powers[id][0];
		}

		
		this.set_skin_by_prefix(skin_prefix);
		
	}
	
	set_skin_by_prefix (prefix) {
		
		this.left_leg1.texture=gres[prefix+'left_leg1'].texture
		this.left_leg2.texture=gres[prefix+'left_leg2'].texture
		this.right_leg1.texture=gres[prefix+'right_leg1'].texture
		this.right_leg2.texture=gres[prefix+'right_leg2'].texture
		
		this.left_arm1.texture=gres[prefix+'left_arm1'].texture
		this.left_arm2.texture=gres[prefix+'left_arm2'].texture
		this.right_arm1.texture=gres[prefix+'right_arm1'].texture
		this.right_arm2.texture=gres[prefix+'right_arm2'].texture
		
		this.spine.texture=gres[prefix+'spine'].texture;
		this.projectile_2.texture=gres[prefix+'projectile'].texture	
		
	}
	
	init() {
		
		this.visible=true;
		
		//устанавливаем текстуры
		this.set_skin_by_id();
						
		//заранее вычисляем когда и как будет направлен следующий снаряд
		this.calc_next_fire();
		
		//устанавливаем вид игрока
		skl_anim.goto_frame(this,skl_throw,0);
				
		this.set_life(skins_powers[this.skin_id][4]*10);
		this.powers.block=skins_powers[this.skin_id][1];
		this.powers.freeze=skins_powers[this.skin_id][2];
		this.powers.fire=skins_powers[this.skin_id][3];
		
	}
	
	set_life(val) {
		
		this.life_level=val;
		this.life_level_front.scale.x=this.life_level*0.01;
		
	}

}

var search_opponent = {

	found_ok: 0,
	wait_time:0,
	start_wait_time:0,
	
    start: function () {

		
		//это время когда начали поиска
		this.start_wait_time=game_tick;		
		this.found_ok=0;
		this.wait_time=Math.random()*10+2;
		state="idle";

		//устанавливаем процессинговую функцию
		g_process=function(){search_opponent.process()};
		
        //++++++++++++++++++++
        anim.add_pos({obj: objects.search_opponent_window,	param: 'y',	vis_on_end: true,	func: 'easeOutBack',	val: [450, 'sy'],	speed: 0.02});		
		
		//выбираем соперника
		let rnd_id=Math.floor(Math.random()*6);
		firebase.database().ref("fake_players/player"+rnd_id).once('value').then((snapshot) => {		
						
			var data=snapshot.val();
			opp_data.name=data.name;
			opp_data.rating=data.rating;
			opp_data.pic_url=data.pic_url;
			
			var loader=new PIXI.Loader();
			loader.add('opp_avatar', opp_data.pic_url,{loadType: PIXI.loaders.Resource.LOAD_TYPE.IMAGE});
			loader.load((loader, resources) => {
				objects.enemy_avatar.texture = resources.opp_avatar.texture;
				
				objects.enemy_name_text.text=opp_data.name;
				objects.enemy_rating_text.text=opp_data.rating;
				
				this.found_ok=1;
			});			
		})

    },

    process: function () {

    	if (state!=="idle")
    	    return;
		
		if (game_tick>this.start_wait_time + this.wait_time){
			
			if (this.found_ok===1)
				this.found();	
			
		}

        objects.search_opponent_progress.rotation += 0.1;
    },

	found: function () {
		
        //убриаем окно поиска
        this.hide();

        state="playing";
		
		g_process=function(){};
		
		game.h_data = [-30, -40];
		
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

    projectile_class: class extends PIXI.Container {

		constructor() {
			super();
			this.x0 = 0;
			this.y0 = 0;
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
			this.target = "";
			this.visible=false;

			
			this.process=function(){};
			
			this.p_bcg=new PIXI.Sprite();this.p_bcg.anchor.set(0.5,0.5);
			this.p_sprite=new PIXI.Sprite();this.p_sprite.anchor.set(0.5,0.5);
			this.power='none';
			
			
			this.addChild(this.p_bcg, this.p_sprite);
			
			app.stage.addChild(this);			
			
		};		
		
		activate(Q,P, target, spear, power) {
			
			power==='none'&&(this.p_bcg.texture=gres.zz_projectile.texture);
			power==='freeze'&&(this.p_bcg.texture=gres.projectile_freeze.texture);
			power==='fire'&&(this.p_bcg.texture=gres.projectile_fire.texture);
			this.power=power;
			
			this.p_sprite.texture=spear;			
			
			this.vx0 = Math.cos(Q)*P;
			this.vy0 = Math.sin(Q)*P;
			
			this.target = target;

			if (target.name === "player") {
				this.vx0=-this.vx0;				
				this.x0 = objects.enemy.x+objects.enemy.width/2;
				this.y0 = objects.enemy.y+30;
				this.scale.x=1;
				
			} else {
				
				//запускаем снаряд в зависимости от наклона тела
				let dxv=Math.sin(objects.player.spine.rotation);
				let dyv=-Math.cos(objects.player.spine.rotation);			
				this.x0 = objects.player.x+objects.player.spine.x+dxv*30;
				this.y0 = objects.player.y+objects.player.spine.y+dyv*30;
				this.scale.x=-1;
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

			//в копье работает только первая половина, чтобы не стукнуться о заднюю
			let dir=Math.sign(this.vx0);
			
			let x0 = this.x ;
			let y0 = this.y ;		
			
			let x1 = this.x + dir * dx * cor_width / 2;
			let y1 = this.y + dir * dy * cor_width / 2;

			return [x0, y0, x1, y1];

		};
		
		stop(int_x,int_y, coll_obj, coll_obj_id) {
				
	
			this.on = 0;
			this.process = this.process_stop;
			
			//это если столкновение не с игроками
			if (coll_obj_id===undefined) {
				this.coll_obj_id=undefined;
				return;				
			}

			
			this.int_x=int_x;
			this.int_y=int_y;
			
			this.sx=this.x;
			this.sy=this.y;				
			
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
			
			if (this.coll_obj_id===undefined) {
				return;				
			}
			
	
			//это передвижение синхронно с конечностью в которое попала
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

    add: function (Q,P, target, spear, bcg_type) {
		
		for (let i=0;i<10;i++) {
			if (this.a[i].visible===false){
				this.a[i].activate(Q,P, target, spear, bcg_type);
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
		
			//проверяем столкновение с  частями тела игрока или оппонента
			for (let i=0;i<proj.target.cur_col.length;i++) {
				
				let limb_name=proj.target.cur_col[i][0];
				let ref_shape=proj.target.cur_col[i][1];
				let data=proj.target.cur_col[i][2];
				
				for (let p = 0; p < data.length - 1; p++) {									
											
					let res = get_line_intersection(l[0], l[1], l[2], l[3], data[p][0], data[p][1], data[p + 1][0], data[p + 1][1]);
					if (res[0] !== -999 && proj.on===1) {
						
						//останавливаем копье
						proj.stop(res[0], res[1], proj.target.cur_col[i][2], p);
						
						//основной уровн копья
						let sum_damage=proj.P;
						
						if (limb_name==="head")
							sum_damage=sum_damage*1.5;
												
						proj.power==='freeze'&&(proj.target.make_frozen());						
						proj.power==='fire'&&(proj.target.make_on_fire());
						
						
						//добавляем поток крови и данные объекта с которым она столкнулась
						particle_engine.add(res[0], res[1], -Math.sign(proj.vx0),sum_damage*0.3, proj.target.cur_col[i][2], p);						
											
						//уменьшаем жизнь
						proj.target.decrease_life(Math.round(sum_damage*0.05));
						
						console.log(sum_damage);
						
						//показываем хэдшот
						if (limb_name==="head")						
							game.add_headshot(proj.target);
					}						
				}					
			}	
			
			//проверяем столкновение с блоками
			if (proj.target.block.visible===true) {
				
				let bx=proj.target.x+proj.target.block.x;
				let by=proj.target.y+proj.target.block.y;
				let r=proj.target.block.width*0.5;
				
				let dx1=bx-l[0];
				let dy1=by-l[1];
				
				let dx2=bx-l[2];
				let dy2=by-l[3];
				
				let d1=Math.sqrt(dx1*dx1+dy1*dy1);
				let d2=Math.sqrt(dx2*dx2+dy2*dy2);
				
				if (d1<r || d2<r)
					proj.stop();
				
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

var mini_process={
	
	
	mp_array: [null, null, null, null, null, null, null, null, null, null, null],

	add : function(mp, obj) {

		for (var i = 0; i < this.mp_array.length; i++) {

			if (this.mp_array[i]===null) {

				obj.ready=false;
				this.mp_array[i]={
					p: mp,
					obj: obj,	
					st: game_tick,
					p_i:0,
				}
				return;
			}

		}
	},
	 
	process: function() {	
	
		for (var i = 0; i < this.mp_array.length; i++) {
			
			if (this.mp_array[i]!==null) {

				let mp=this.mp_array[i];
				let ct=game_tick-mp.st;
				
				//проверяем достигло ли время следующей точки процесса (анимации)
				if (ct>mp.p[mp.p_i][0]) {					
					
					mp.p[mp.p_i][1]!==undefined&&(mp.obj.x=mp.obj.sx+mp.p[mp.p_i][1]);
					mp.p[mp.p_i][2]!==undefined&&(mp.obj.y=mp.obj.sy+mp.p[mp.p_i][2]);
					mp.p[mp.p_i][3]!==undefined&&(mp.obj.rotation=mp.p[mp.p_i][3]);
					mp.p[mp.p_i][4]!==undefined&&(mp.obj.alpha=mp.p[mp.p_i][4]);
					mp.p[mp.p_i][5]!==undefined&&(mp.obj.scale.x=mp.p[mp.p_i][5]);
					mp.p[mp.p_i][6]!==undefined&&(mp.obj.scale.y=mp.p[mp.p_i][6]);
					mp.p[mp.p_i][7]!==undefined&&(mp.obj.visible=mp.p[mp.p_i][7]);
					
					mp.p_i++;			
					
					if (mp.p_i===mp.p.length) {
						this.mp_array[i]=null;
						mp.obj.ready=true;						
					}
					
					
				}
			}	
		}		
	}
	
	
	
}

var main_menu = {
	
	tween_spd: 1,
	start_time:0,
	activate : function() {
		
		//++++++++++++++++++++
		anim.add_pos({obj: objects.main_buttons_cont,	param: 'y',	vis_on_end: true,	func: 'easeOutBack',	val: [450, 'sy'],	speed: 0.02	});
			
		objects.start_player.visible=true;
		objects.start_player.init(0);

		objects.start_player.life_level_bcg.visible=false;
		objects.start_player.life_level_frame.visible=false;
		objects.start_player.life_level_front.visible=false;
		objects.start_player.scale.x=objects.start_player.scale.y=2;
		
		objects.sprite_001.visible=true;
		
		//устанавливаем фон
		objects.bcg.texture=game_res.resources["bcg_1"].texture;

		
		this.start_time=game_tick;
		
		//устанавливаем процессинговую функцию
		g_process=function(){main_menu.process()};
		
		
	},
	
	//нажатие на кнопку
	play_button_down: function() {
		
        if (objects.main_buttons_cont.ready === false || any_dialog_active===1)
            return;
				
		//*********выходим из состояния главного меню**********
		
		this.hide();
		
		
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
		objects.start_player.visible=false;
		

		//------------------------
		anim.add_pos({obj: objects.main_buttons_cont,param: 'y',vis_on_end: false,func: 'easeInBack',val: ['sy',450],speed: 0.02});
		anim.add_pos({obj: objects.my_data_cont,param: 'alpha',	vis_on_end: false,	func: 'linear',	val: [1,0],	speed: 0.02	});
		
	},
	
	change_tween_spd: function() {		
		this.tween_spd=Math.random()+0.5;	
		setTimeout(main_menu.change_tween_spd, 3000);
	},
	
	shop_button_down: function() {
		
		this.hide();
		shop.activate();
		
		
	},
	
	process: function() {			
		
		if (game_tick>this.start_time+5) {
			skl_anim.activate(2,skl_throw);
			this.start_time=game_tick;
		}

		if (skl_anim.slots[2].on===0)
			skl_anim.tween(objects.start_player,skl_prepare,Math.sin(game_tick*this.tween_spd)*0.5+0.5);
	}
	
}

var shop={
	
	start_time:0,
	tween_spd: 1,
	sel_skin: 0,
	
	activate: function() {
		
		objects.shop_player.life_level_bcg.visible=false;
		objects.shop_player.life_level_frame.visible=false;
		objects.shop_player.life_level_front.visible=false;
		objects.shop_player.stand.visible=false;
		
		objects.shop_player.scale.x=objects.shop_player.scale.y=1.8;
		objects.shop_player.init();	
		
		objects.shop_cont.visible=true;
		objects.bcg.texture=gres.shop_bcg.texture;
		
		//устанавливаем вид и параметры текущего скина
		this.sel_skin=objects.start_player.skin_id=objects.player.skin_id;
		this.next_button_down(0);
		
		this.start_time=game_tick;
		
		//устанавливаем процессинговую функцию
		g_process=function(){shop.process()};
	},
	
	process: function() {			
		
		if (game_tick>this.start_time+5) {
			skl_anim.activate(3,skl_throw);
			this.start_time=game_tick;
		}

		if (skl_anim.slots[3].on===0)
			skl_anim.tween(objects.shop_player,skl_prepare,Math.sin(game_tick*this.tween_spd)*0.5+0.5);
	},
	
	next_button_down: function(v) {
		
		this.sel_skin+=v;
		this.sel_skin>=(skins_powers.length-1)&&(this.sel_skin=skins_powers.length-1);
		this.sel_skin===-1&&(this.sel_skin=0)
		
		
		
		objects.shop_player.set_skin_by_id(this.sel_skin);	
		
		let blocks=skins_powers[this.sel_skin][1];
		let freeze=skins_powers[this.sel_skin][2];
		let fire=skins_powers[this.sel_skin][3];
		let life=skins_powers[this.sel_skin][4];
		
		
		for (let x=0;x<8;x++)
			x<blocks? objects.shop_leds[x].visible=true:objects.shop_leds[x].visible=false;
		
		for (let x=0;x<8;x++)
			x<freeze? objects.shop_leds[x+8].visible=true:objects.shop_leds[x+8].visible=false;
		
		for (let x=0;x<8;x++)
			x<fire? objects.shop_leds[x+16].visible=true:objects.shop_leds[x+16].visible=false;
		
		for (let x=0;x<8;x++)
			x<life? objects.shop_leds[x+24].visible=true:objects.shop_leds[x+24].visible=false;
	},
	
	buy_button_down: function() {
		
		//присваиваем айди скина
		objects.player.skin_id=this.sel_skin;
		
		
		big_message.show("Вы купили нового персонажа", ")))");
		
	},
	
	back_button_down: function() {
		
		objects.shop_cont.visible=false;	
		objects.shop_leds.forEach(e=>{e.visible=false});
		objects.bcg.texture=gres.bcg_0.texture;
		main_menu.activate();
		
	}
	
}

var power_buttons = {
		
	selected_power: 'none',
	rem_time:{block:0, freeze:0, fire:0},
	
	block_down: function() {
		
		if (objects.player.block.visible===true)
			return;
				
		if (objects.player.powers.block<=0)
			return;
		
		
		this.rem_time.block=game_tick;
		
		//уменьшаем количество
		objects.player.powers.block--;
		objects.block_text.text=objects.player.powers.block;
		
		//убираем кнопку в ожидаение
		anim.add_pos({obj: objects.block_button,	param: 'y',	vis_on_end: false,	func: 'easeInBack',	val: ['sy', -50],	speed: 0.02});
		anim.add_pos({obj: objects.block_text,	param: 'y',	vis_on_end: false,	func: 'easeInBack',	val: ['sy', -50],	speed: 0.02});
		
		//активируем блок
		objects.player.activate_block();
		
	},
	
	freeze_down: function() {
		
		
		if (objects.player.powers.freeze<=0)
			return;
		
		if (this.selected_power==='freeze') {
			this.selected_power='none';				
			objects.player.set_projectile_power('none');		
			objects.upg_button_frame.visible=false;
		} else {
			this.selected_power='freeze';				
			objects.player.set_projectile_power('freeze');		
			objects.upg_button_frame.x=objects.freeze_button.x;
			objects.upg_button_frame.y=objects.freeze_button.y;
			objects.upg_button_frame.visible=true;
		}

		
	},
	
	fire_down: function() {
		
		if (objects.player.powers.fire<=0)
			return;
		
		if (this.selected_power==='fire') {
			this.selected_power='none';				
			objects.player.set_projectile_power('none');		
			objects.upg_button_frame.visible=false;
		} else {
			this.selected_power='fire';				
			objects.player.set_projectile_power('fire');		
			objects.upg_button_frame.x=objects.fire_button.x;
			objects.upg_button_frame.y=objects.fire_button.y;
			objects.upg_button_frame.visible=true;
		}
		
		
	},
	
	process: function() {
		
		if (objects.block_button.visible===false) {
			if (game_tick>this.rem_time.block+5) {
				anim.add_pos({obj: objects.block_button,	param: 'y',	vis_on_end: true,	func: 'easeOutBack',	val: [-50,'sy'],	speed: 0.02});
				anim.add_pos({obj: objects.block_text,	param: 'y',	vis_on_end: true,	func: 'easeOutBack',	val: [-50,'sy'],	speed: 0.02});
			}
		};
		
		if (objects.freeze_button.visible===false) {
			if (game_tick>this.rem_time.freeze+5) {
				anim.add_pos({obj: objects.freeze_button,	param: 'y',	vis_on_end: true,	func: 'easeOutBack',	val: [-50,'sy'],	speed: 0.02});
				anim.add_pos({obj: objects.freeze_text,	param: 'y',	vis_on_end: true,	func: 'easeOutBack',	val: [-50,'sy'],	speed: 0.02});
			}
		};
		
		if (objects.fire_button.visible===false) {
			if (game_tick>this.rem_time.fire+5) {
				anim.add_pos({obj: objects.fire_button,	param: 'y',	vis_on_end: true,	func: 'easeOutBack',	val: [-50,'sy'],	speed: 0.02});
				anim.add_pos({obj: objects.fire_text,	param: 'y',	vis_on_end: true,	func: 'easeOutBack',	val: [-50,'sy'],	speed: 0.02});
			}
		};
		
	},
	
	freeze_fired: function() {
		
		this.rem_time.freeze=game_tick;
	
		objects.player.powers.freeze--;
		objects.freeze_text.text=objects.player.powers.freeze;
		
		//убираем кнопку в ожидаение
		anim.add_pos({obj: objects.freeze_button,	param: 'y',	vis_on_end: false,	func: 'easeInBack',	val: ['sy', -50],	speed: 0.02});
		anim.add_pos({obj: objects.freeze_text,	param: 'y',	vis_on_end: false,	func: 'easeInBack',	val: ['sy', -50],	speed: 0.02});
		
	},
	
	fire_fired: function() {
		
		this.rem_time.fire=game_tick;
		
		objects.player.powers.fire--;
		objects.fire_text.text=objects.player.powers.fire;		
		
		//убираем кнопку в ожидаение
		anim.add_pos({obj: objects.fire_button,	param: 'y',	vis_on_end: false,	func: 'easeInBack',	val: ['sy', -50],	speed: 0.02});
		anim.add_pos({obj: objects.fire_text,	param: 'y',	vis_on_end: false,	func: 'easeInBack',	val: ['sy', -50],	speed: 0.02});
	},
	
	init: function () {
		
		anim.add_pos({obj: objects.power_buttons_cont,	param: 'y',	vis_on_end: true,	func: 'easeOutBack',	val: [450, 'sy'],	speed: 0.02	});
		objects.block_text.text=objects.player.powers.block;
		objects.freeze_text.text=objects.player.powers.freeze;
		objects.fire_text.text=objects.player.powers.fire;
		
	}
	
	
}

var fp= {

	
	update : function() {		
		
		var fake_users={"response":[{"first_name":"Рома","id":507283181,"last_name":"Булькин","can_access_closed":true,"is_closed":false,"photo_100":"https:\/\/sun7-6.userapi.com\/s\/v1\/ig2\/LkRGH-HCSuhPi2ByyrLsRt27a8ML0__vuSPJFl53CiK6lh7Ndg02XUmagQoCNM1pdp0mWk5rR2uqLsnMQUucrCXp.jpg?size=100x0&quality=96&crop=8,0,591,591&ava=1"},{"first_name":"Moona","id":623665245,"last_name":"Fıcherbert","can_access_closed":false,"is_closed":true,"photo_100":"https:\/\/sun7-13.userapi.com\/s\/v1\/ig2\/vsRlANcqq2o6fT3oPFK3FYsy8uCGmZh2NzuJ5rucFJDB7oT4BREYh6SGTzYmXBNBlNZkRSZNGbY4-OWYE8qpcqNq.jpg?size=100x0&quality=96&crop=541,581,1156,1156&ava=1"},{"first_name":"Irina","id":234918613,"last_name":"Fadeeva","can_access_closed":false,"is_closed":true,"photo_100":"https:\/\/sun7-8.userapi.com\/s\/v1\/ig2\/G2rq96n4Wjkv3g4eWhwTaS38qpLgyd4jHnKOpUS77SAJS5BWIRTw8hNEMALWRm1evwzwfuOE4RfksZwuS0m3SBIc.jpg?size=100x0&quality=96&crop=0,459,1333,1333&ava=1"},{"first_name":"Полина","id":200131962,"last_name":"Ермолович","can_access_closed":true,"is_closed":false,"photo_100":"https:\/\/sun7-6.userapi.com\/s\/v1\/ig2\/O6DFyQLmt2zppmG5ooXGZYh4QvQuhER9AqKMmoRP5o8qDSGJRrUS5NWP0cbE1Qkp6MAZ36eSS-T9xHN4BADy1R3Z.jpg?size=100x0&quality=96&crop=60,87,974,974&ava=1"},{"first_name":"Роман","id":375350802,"last_name":"Морозов","can_access_closed":true,"is_closed":false,"photo_100":"https:\/\/sun7-9.userapi.com\/s\/v1\/ig2\/wiwTO-He6NV50qCRPoBOCRGwkcNSnFOOHZC-BpsFg0wNVDZGCCv18FJboInF9Xr7OiX8RYgTG_rszGl90dVaMGAB.jpg?size=100x0&quality=96&crop=394,893,788,788&ava=1"},{"first_name":"Fernando","id":330875441,"last_name":"Sucre","can_access_closed":true,"is_closed":false,"photo_100":"https:\/\/sun7-14.userapi.com\/s\/v1\/ig2\/ybhYg29zIigakUZJsfQq2HGPtmKF9v7ZjxNmO43P8vnpv0gWPN7nOFjYJDh32S3we7xJIEiS6HSq0tiGyCEGHSBT.jpg?size=100x0&quality=96&crop=0,251,900,900&ava=1"},{"first_name":"Алёна","id":376119283,"last_name":"Фатахова","can_access_closed":false,"is_closed":true,"photo_100":"https:\/\/sun7-9.userapi.com\/s\/v1\/ig2\/Sl9czb7DdXfm1ApU6yNxAkxZPUbeUYgMBDicoLdOXd7Xoke2qXJ4ESeaGxEKrLD6manObQLQmOVjz-4VEM-uFJ6M.jpg?size=100x0&quality=96&crop=216,216,1728,1728&ava=1"}]};
		
		fake_users=fake_users.response;
		
		fake_users.forEach((user,index)=>{			
			firebase.database().ref("fake_players/player"+index).set({name:user.first_name+' ' +user.last_name, pic_url:user.photo_100, rating:1400});
		})		
	}	

}

var game = {

	p_time: 0,
	sec_check:0,
	h_data:[0,0],
	cur_round: 0,
	block_start_time: 0,
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
		
		//восстанавливаем жизни и количество копий
		objects.enemy.skin_id=~~(Math.random()*6);
		
		objects.player.init();
		objects.enemy.init();
		
	
		//добаляем кнопки 
		power_buttons.init();
	
					
		//включаем табло оппонента
		objects.player_card_cont.visible = true;
		objects.enemy_card_cont.visible = true;
		
		//обновляем мои данные
		objects.player_avatar.texture=objects.my_data_photo.texture;
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
		
		//выключаем табло оппонента
		objects.player_card_cont.visible = false;
		objects.enemy_card_cont.visible = false;
		
		objects.power_buttons_cont.visible = false;

		main_menu.activate();
		
	},
		
	process_round: function(init) {
		
        if (init === 1) {			
		
			this.p_time=game_tick;
			this.state="playing"	
						
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
				//firebase.database().ref("players/" + my_data.uid+"/rating").set(my_data.rating);	
				//firebase.database().ref("players/" + my_data.uid+"/exp").set(my_data.exp);	
			}
				
			if (res===1) {
				exp.upgrade(3);	
				my_data.rating+=1;
				big_message.show("Победа","Рейтинг: +1\nОпыт: +3");					
				//firebase.database().ref("players/" + my_data.uid+"/rating").set(my_data.rating);	
				//firebase.database().ref("players/" + my_data.uid+"/exp").set(my_data.exp);	
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
		
		if (t.name==="player") 		
			anim.add_pos({obj:objects.headshot,param:'x',vis_on_end:true,func:'easeOutElastic',val:[-130, 	70],	speed:0.04});
		
		if (t.name==="enemy")		
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
		
		if (objects.player.frozen===1)
			return;

        this.touch_data.x0 = e.data.global.x / app.stage.scale.x;
        this.touch_data.y0 = e.data.global.y / app.stage.scale.y;

        this.touch_data.x1 = this.touch_data.x0;
        this.touch_data.y1 = this.touch_data.y0;

		guide_line.visible = objects.dir_line.visible = objects.power_level_cont.visible = true;
		
		objects.power_slider.scale.x=0;
		
		this.p=0;
		
		objects.dir_line.x = objects.player.x+objects.player.width/2;
		objects.dir_line.y = objects.player.y+40;
		
        drag = 1;
    },

    move: function (e) {
		
		if (objects.player.frozen===1)
			return;

        if (drag === 1) {
            this.touch_data.x1 = e.data.global.x / app.stage.scale.x;
            this.touch_data.y1 = e.data.global.y / app.stage.scale.y;
            
			let dx = this.touch_data.x1 - this.touch_data.x0;
			let dy = this.touch_data.y1 - this.touch_data.y0;

			let v0 = Math.sqrt(dx * dx + dy * dy);
			v0 = Math.max(50, Math.min(v0, 80));

			this.Q = Math.atan2(dy, dx);
			this.Q = Math.max(-0.9, Math.min(this.Q, 0.758398));
			
			skl_anim.tween(objects.player,skl_prepare,0.5+this.Q/0.785398/2);

			//обновляем данные на основе корректированной длины
			this.touch_data.x1 = this.touch_data.x0 + v0 * Math.cos(this.Q);
			this.touch_data.y1 = this.touch_data.y0 + v0 * Math.sin(this.Q);

			guide_line.clear();
			guide_line.lineStyle(1, 0x00ff00)
			guide_line.moveTo(this.touch_data.x0, this.touch_data.y0);
			guide_line.lineTo(this.touch_data.x1, this.touch_data.y1);
			
			
			//отображаем направляющую в зависимости от наклона тела
			let dxv=Math.sin(objects.player.spine.rotation);
			let dyv=-Math.cos(objects.player.spine.rotation);			
			objects.dir_line.x = objects.player.x+objects.player.spine.x+dxv*30;
			objects.dir_line.y = objects.player.y+objects.player.spine.y+dyv*30;
					
			
			objects.dir_line.rotation=this.Q;

        }

    },

    up: function () {

        guide_line.visible = objects.dir_line.visible = objects.power_level_cont.visible = false;

		if (game.state!=="playing")
			return;
		
		if (objects.player.frozen===1)
			return;
		
        if (drag === 0)
            return;
		

        drag = 0;
		
		//запускаем локальный снаряд
        projectiles.add(this.Q,objects.power_slider.scale.x*100+50, objects.enemy,objects.player.projectile_2.texture, objects.player.projectile_power);
		
		//сообщаем что отрправлен мощный снаряд
		objects.player.projectile_power==='freeze'&&(power_buttons.freeze_fired());
		objects.player.projectile_power==='fire'&&(power_buttons.fire_fired());

		
		//убираем выделение
		objects.upg_button_frame.visible=false;
		objects.player.projectile_power='none';
		

		//убираем текстуры копья
		objects.player.projectile_bcg.texture=null;
		
		//убираем копье и возвращаем его через некоторое время
		objects.player.projectile.visible=false;
		objects.player.zz_projectile.visible=false;
		setTimeout(function(){objects.player.projectile.visible=true;objects.player.zz_projectile.visible=true},700);			
		
		//запускаем анимацию
		skl_anim.activate(0,skl_throw);
    },
	
	stop: function() {
		
		guide_line.visible = objects.dir_line.visible = objects.power_level_cont.visible = false;
		drag = 0;
		
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
    user_data.local();

    //подключаем события нажатия на поле
    objects.bcg.pointerdown = touch.down.bind(touch);
    objects.bcg.pointermove = touch.move.bind(touch);
    objects.bcg.pointerup = touch.up.bind(touch);

    app.stage.addChild(guide_line, guide_line2);

	//добавить фейковых игроков в базу данных
	fp.update();
	
	main_menu.activate();
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
		
	//добавляем огонь
	for (var i = 0; i < 32; i++)
		game_res.add("fire"+i, "res/fire/image_part_0"+(i+1)+ ".png");

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
	

	power_buttons.process();

	//обработка моих событий
	test_sprite.clear();
	
	skl_anim.process();
	objects.player.process();
	objects.enemy.process();

    //глобальный процессинг
    g_process();

    anim.process();
	//mini_process.process();
	
    app.render(app.stage);
    requestAnimationFrame(main_loop);
    game_tick += 0.01666666;
}

