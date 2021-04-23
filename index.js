var M_WIDTH=800, M_HEIGHT=450;
var app, game_res,  objects={}; 
var my_data={},opp_data={};
var g_process=()=>{};

var mouse_pos;
var touch_data={x0:-999, y0:-999, x1:-999, y1:-999};
var guide_line=new PIXI.Graphics();
var guide_line2=new PIXI.Graphics();
var drag=0; game_tick=0;
var initiator="me";

var left_body_col=[[125,383],[115,380],[113,358],[103,346],[92,343],[96,333],[100,323],[100,312],[91,303]];
var left_head_col=[[94,303],[96,294],[96,291],[92,287],[92,284],[78,284],[75,296]];

var right_body_col=[[678,253],[687,250],[690,227],[699,216],[711,212],[707,202],[703,193],[703,181],[714,172]];
var right_head_col=[[708,174],[706,165],[706,162],[709,157],[709,154],[721,154],[725,162]];


var particle_engine={
	
	sx: 0, sy: 0, sprites: [], count: 0, dir: 1, start_time: -999,
	
	init: function() {
		
		for (let i = 0; i < 50; i++) {		

			const prtcl = new PIXI.Sprite(game_res.resources["blood_particle"].texture);
			prtcl.visible=false;
			prtcl.y_inc=Math.random()/50+0.01;
			prtcl.x_spd=Math.random()*5+3;
			prtcl.sx=prtcl.sy=prtcl.x_traveled=0;
			prtcl.anchor.set(0.5,0.5);
			this.sprites.push(prtcl);
			app.stage.addChild(prtcl);
		};
		
	},
	
	start: function(x, y, dir) {
				
		this.sx=x;
		this.sy=y;
		this.dir=dir;		

		this.start_time=game_tick;
	},
	
	add_particle: function() {
		
		for (let i=0;i<this.sprites.length;i++) {
			let t=this.sprites[i];
			if (t.visible===false) {				
				t.x=t.sx=this.sx;
				t.y=t.sy=this.sy;				
				t.scale.x=t.scale.y=0.1;				
				t.x_traveled=0;				
				t.y_inc=Math.random()/50+0.01;				
				t.visible=true;				
				t.alpha=1;					
				return;
			}
		}
		
	},
	
	process: function () {
		
		//постоянно добавляем частицы
		if (game_tick<this.start_time+1)
			this.add_particle();
				
		//обрабатываем все частицы
		this.sprites.forEach(item=>{
			
			if (item.visible===true) {
				
				item.x_traveled+=item.x_spd*this.dir;
				item.x=item.sx+item.x_traveled;
				item.y=item.sy+item.x_traveled*item.x_traveled*item.y_inc;
				
							
				item.scale.x+=0.1;
				item.scale.y+=0.1;
				item.alpha=1-item.x/(-200);
				
				if (item.y>500) 
					item.visible=false;
			}				
		})
		
		
	}

}

function get_line_intersection(p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y) {
	let i_x, i_y;
    let s1_x, s1_y, s2_x, s2_y;
    s1_x = p1_x - p0_x;     s1_y = p1_y - p0_y;
    s2_x = p3_x - p2_x;     s2_y = p3_y - p2_y;

    let s, t;
    s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
    t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
        return [p0_x + (t * s1_x), p0_y + (t * s1_y)];
    return [-999, -999];
}




var me={
		
	body_col: [[125,383],[115,380],[113,358],[103,346],[92,343],[96,333],[100,323],[100,312],[91,303]],
	head_col: [[94,303],[96,294],[96,291],[92,287],[92,284],[78,284],[75,296]],
	life_level: 100,
	updade_col: function(h_dist) {
		
		for (let i=0;i<left_body_col.length;i++){
			this.body_col[i][0]=left_body_col[i][0];
			this.body_col[i][1]=left_body_col[i][1]+h_dist;			
		};
		
		for (let i=0;i<left_head_col.length;i++){
			this.head_col[i][0]=left_head_col[i][0];
			this.head_col[i][1]=left_head_col[i][1]+h_dist;			
		};
		
	},
	process: function(){		
		
	},	
	shift : function(dx,dy) {	
		
	}
}

var opponent={
		
	body_col: [[125,383],[115,380],[113,358],[103,346],[92,343],[96,333],[100,323],[100,312],[91,303]],
	head_col: [[94,303],[96,294],[96,291],[92,287],[92,284],[78,284],[75,296]],

	life_level: 100,
	updade_col: function(h_dist) {
		
		for (let i=0;i<right_body_col.length;i++){
			this.body_col[i][0]=right_body_col[i][0];
			this.body_col[i][1]=right_body_col[i][1]+h_dist;			
		};
		
		for (let i=0;i<right_head_col.length;i++){
			this.head_col[i][0]=right_head_col[i][0];
			this.head_col[i][1]=right_head_col[i][1]+h_dist;			
		};
		
	},
	process: function(){
		
	},	
	shift : function(dx,dy) {		
		
	}
}

var game={
	
	state: "online", pending_player: "", player_states: [], search_timeout_handler:0,wait_start:0,
		
	close_search_window: function() {
				
		if (objects.search_opponent_window.ready===false)
			return;
		
		this.state="online";		
		
		//показываем контейнер с кнопками
		objects.start_buttons_cont.show();
		anim.add(objects.start_buttons_cont,'y',true,'easeOutCubic',-390, objects.start_buttons_cont.sy,0.02);
		
		//убираем контейнер с окном ожидания
		anim.add(objects.search_opponent_window,'y',false,'easeInCubic',objects.search_opponent_window.sy,M_HEIGHT,0.04);
	},
		
	start_idle_wait: function () {
		
		if (this.state==="idle" || objects.start_buttons_cont.ready===false)
			return;
				
		//показываем контейнер с ожиданием
		if (objects.search_opponent_window.visible===false)
			anim.add(objects.search_opponent_window,'y',true,'easeOutCubic',-390, objects.search_opponent_window.sy,0.02);
		
		//убираем контейнер с кнопками
		if (objects.start_buttons_cont.visible===true)
			anim.add(objects.start_buttons_cont,'y',false,'easeInCubic',objects.start_buttons_cont.sy,M_HEIGHT,0.02);

		//устанавливаем локальный статус
		this.state="idle";
	
		//устанавливаем статус в базе данных
		firebase.database().ref("states/"+my_data.uid).set("idle");

		//запускаем поиск через определенное время
		this.search_timeout_handler=setTimeout(this.search_and_send_request.bind(this), Math.floor(Math.random()*5000));
		
	},
	
	search_and_send_request() {
			
		if (this.state!=="idle") return;
			

		for (var player_id in this.players_states) {

			if (player_id!==my_data.uid && this.players_states[player_id]==="idle")	{			
				firebase.database().ref("inbox/"+player_id).set({sender:my_data.uid,message:"REQ",timestamp:Date.now(),data:"-"});	
				this.pending_player=player_id;
				this.state="wait_response";
				this.wait_start=Date.now();
				console.log("sent REQ to "+player_id);
				return;
			}
		}
		
		//если пользователей не нашли то через некоторое время запускаем новый поиск
		this.search_timeout_handler=setTimeout(this.search_and_send_request.bind(this), Math.floor(Math.random()*5000)+1000);
	},
	
	players_list_updated(players) {

		this.players_states=players;
		var cnt=0;
		for (var player_id in this.players_states)
			if (this.players_states[player_id]!=="offline")
				cnt++;
		
		objects.online_users_text.text="Игроков онлайн: "+cnt;
	},
	
	process_new_message: function(msg) {	

		//Получили запрос на новую игру
		console.log("Сообщение: "+msg.message+ " Состояние: "+this.state +" sender:"+msg.sender +" pending: "+this.pending_player);
		
		if (this.state==="idle") {		
		
			//в данном состоянии принимаем только запросы о новой игре
			if (msg.message==="REQ") {		
			
				//отправляем сообщение о начале игры
				firebase.database().ref("inbox/"+msg.sender).set({sender:my_data.uid,message:"OK",timestamp:Date.now(),data:0});
				initiator="opponent";			
				this.start_game(msg.sender);		
			}			
		}
				
		//получение положительного ответа от игрока которому мы отправляли запрос и который уже создал игру
		if (this.state==="wait_response") {
			
			//принимаем только положительный ответ от соответствующего соперника и начинаем игру
			if (msg.message==="OK"  && this.pending_player===msg.sender) {				
				initiator="me";
				this.start_game(msg.sender);	
			}
								

		}
		
		//получение сообщение в состояни игры
		if (this.state==="playing") {
			
			//учитываем только сообщения от соперника
			if (msg.sender===opp_data.uid) {
				
				//получение сообщение с ходом игорка
				if (msg.message==="MOVE")
					this.receive_move(msg.data);

				//получение сообщение с сдаче
				if (msg.message==="END" )
					this.finish_game(msg.data.board_state);	

				//получение стикера
				if (msg.message==="MSG")
					this.receive_sticker(msg.data);
				
				//получение отказа от игры
				if (msg.message==="REFUSE")
					this.finish_game(16);
				
				//получение согласия на игру
				if (msg.message==="CONF")
					this.opp_confirmed_play=true;
				
			}
		}
	
	},
	
	read_opponent_data: function(opp_uid) {
		
		firebase.database().ref("players/"+opp_uid).once('value').then((snapshot) => {
		  if (snapshot.val()===null) {
			  alert("Не получилось загрузить данные о сопернике");
		  }
		  else {
			  
			  
			opp_data={...opp_data,...snapshot.val()};			  
		
			//загружаем аватар соперника
			var loaderOptions = {loadType: PIXI.loaders.Resource.LOAD_TYPE.IMAGE};
			var player_data=snapshot.val();
			var loader = new PIXI.Loader(); // PixiJS exposes a premade instance for you to use.
			loader.add('opponent_avatar', opp_data.pic_url,loaderOptions);
			loader.load((loader, resources) => {objects.opponent_avatar.texture = resources.opponent_avatar.texture;});
			
			//также отображаем имя
			let trimmed_text=opp_data.first_name +" "+opp_data.last_name;
			trimmed_text = trimmed_text.length > 15 ?  trimmed_text.substring(0, 12) + "..." : trimmed_text;
			objects.opponent_name_text.text=trimmed_text;
			objects.opponent_rating_text.text=opp_data.rating;
			
		  }
		});
		
	},
	
	start_game : function(opp_uid) {
		
		

		
		//нужно загрузить данные о сопернике и его фото
		opp_data.uid=opp_uid;
		this.read_opponent_data(opp_data.uid);
		
		if (initiator==="me") {
			me.updade_col(0);
			opponent.updade_col(0);
			[objects.opponent_cont.y, objects.my_cont.y]=[ objects.opponent_cont.y,objects.my_cont.y];
		}else{
			let dif=right_head_col[0][1]-left_head_col[0][1];
			me.updade_col(dif);
			opponent.updade_col(-dif);
			[objects.opponent_cont.y, objects.my_cont.y]=[objects.my_cont.y,objects.opponent_cont.y];
		}
		
		//убираем окно ожидания
		anim.add(objects.search_opponent_window,'y',false,'easeInCubic', objects.search_opponent_window.sy,-390,0.02);
		
		//отключаем подписку на обновление пользователей
		firebase.database().ref("states").off();
		
		//добавляем подписку на состояние оппонента
		firebase.database().ref("states/"+opp_data.uid).on('value', (snapshot) => { this.opponent_state_changed(snapshot.val());});
		
		//записываем что игрок перешел в сосотяние игры
		firebase.database().ref("states/"+my_data.uid).set("playing");
		this.state="playing";
		
	},
	
	opponent_state_changed: function(s) {			
		if (s==="offline" || s==="online")
			alert("Оппонент поникул игру");
	},
	
	receive_move: function(t_data) {
		
		[t_data.x0,t_data.x1]=[t_data.x1,t_data.x0];
		
		let projectile_data=calc_projectile_parameters(t_data);
		projectile.add(projectile_data,"me");
		console.table( t_data)
	},
	
	send_move: function(t_data) {
			
			if (this.state!=="playing") {
				//alert("Игра не создана");
				return;			
			}	
					
					
			//отправляем ход с состоянием оппоненту
			firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"MOVE",timestamp:Date.now(),data:t_data});
		}
	
}
var projectile={
	
	i:0, t_inc:0, vy0:0, vx0:0, shift_x:0, shift_y:0, x_inc: 1, on : 0, target : "me", process: function (){},
	
	add: function(projectile_data, target) {
		
		this.vx0	=	projectile_data.vx0;
		this.vy0	=	projectile_data.vy0;
		this.t_inc	=	projectile_data.t_inc*Math.sign(this.vx0);
		
		this.target=target;
		this.x_inc	= target==="me" ?	this.vx*16: -this.vx*16 ;
			
		if (target==="me") {
			this.x_inc	= -16;
			this.shift_x = objects.opponent_cont.x+objects.opponent_top.x;
			this.shift_y = objects.opponent_cont.y;			
		} else {
			this.x_inc	= 16;
			this.shift_x = objects.my_cont.x+objects.my_top.x;
			this.shift_y = objects.my_cont.y;
		}
		
		this.i=0;
		this.on=1;
		objects.arrow.visible=true;
		objects.arrow.alpha=1;	

		this.process=this.process_go;

	},
		
	get_line: function() {
		
		let dx=Math.cos(objects.arrow.rotation);
		let dy=Math.sin(objects.arrow.rotation);
		
		let x0=objects.arrow.x+dx*objects.arrow.width/2;
		let y0=objects.arrow.y+dy*objects.arrow.width/2;
		
		let x1=objects.arrow.x-dx*objects.arrow.width/2;
		let y1=objects.arrow.y-dy*objects.arrow.width/2;
		
		return [x0,y0,x1,y1];
		
	},
	
	stop: function() {
		
		this.on=0;
		this.process=this.process_stop;
		
	},
	
	process_go: function() {
		
		if (objects.arrow.visible===false)
			return;
					
		let t=this.i*this.t_inc;		
		let vy=this.vy0+t*9.8;
		objects.arrow.rotation=Math.atan2(vy, this.vx0);

		objects.arrow.x=this.shift_x+this.i*this.x_inc;
		objects.arrow.y=this.shift_y+this.vy0*t+0.5*9.8*t*t;
		
		if (objects.arrow.x>900 || objects.arrow.x<-100 || objects.arrow.y>600 || objects.arrow.x<-100)
			objects.arrow.visible=false;
		
		this.i++;
				
		if (this.i===51) {	need_throw=0;	objects.arrow.visible=false;};
	},
	
	process_stop: function () {
		
		objects.arrow.alpha-=0.04;
		if (objects.arrow.alpha<=0)	{
			objects.arrow.alpha=1;
			objects.arrow.visible=false;
			this.process=()=>{};
		}
		
	}

}

function process_collisions() {
	
	if (projectile.on===1) {
		
		let target=window[projectile.target];
		let targets=[target.body_col,target.head_col];
		let l=projectile.get_line();
		
		targets.forEach((obj)=>{
			for (let i=0;i<obj.length-1;i++) {
				
				let res=get_line_intersection(l[0],l[1],l[2],l[3], obj[i][0], obj[i][1], obj[i+1][0], obj[i+1][1]);
				if (res[0]!==-999) {
					particle_engine.start(res[0],res[1],-Math.sign(projectile.x_inc));
					projectile.stop();
					return 1;			
				}
			}	
		})
	}
	
}

var anim={
		
	c1: 1.70158,
	c2: 1.70158 * 1.525,
	c3: 1.70158 + 1,
	c4: (2 * Math.PI) / 3,
	c5: (2 * Math.PI) / 4.5,
	
	anim_array: [null,null,null,null,null,null,null,null,null],	
	linear: function(x) {
		
		return x
	},
	linear_and_back: function(x) {
		
		return x < 0.2 ? x*5 : 1.25 - x * 1.25

	},
	easeOutElastic: function(x) {
		return x === 0
			? 0
			: x === 1
			? 1
			: Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
	},	
	easeOutBounce: function(x) {
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
	easeOutCubic: function(x) {
		return 1 - Math.pow(1 - x, 3);
	},
	easeOutQuart: function(x) {
		return 1 - Math.pow(1 - x, 4);
	},
	easeOutQuint: function(x) {
		return 1 - Math.pow(1 - x, 5);
	},
	easeInCubic: function(x) {
		return x * x * x;
	},
	easeInQuint: function(x) {
		return x * x * x * x * x;
	},
	easeOutBack: function(x) {
		return 1 + this.c3 * Math.pow(x - 1, 3) + this.c1 * Math.pow(x - 1, 2);
	},
	easeInBack: function(x) {
		return this.c3 * x * x * x - this.c1 * x * x;
	},
	add: function(obj,param,vis_on_end,func,start_val,end_val,speed, callback){
		
		if (callback===undefined)
			callback=()=>{};
		
		//ищем свободный слот для анимации
		for (var i=0;i<this.anim_array.length;i++)	{
			
			if (this.anim_array[i]===null)	{
			
				obj.visible=true;
				obj.alpha=1;
				obj.ready=false;
				obj[param]=start_val;
				var delta=end_val-start_val;	
				this.anim_array[i]={obj:obj,param:param,vis_on_end:vis_on_end,delta:delta,func:this[func],start_val:start_val,speed:speed,progress:0, callback: callback};	
				return;
			}
			
		}
		
		alert("Нет свободных слотов для анимации");
		
	},
	process: function()	{
		for (var i=0;i<this.anim_array.length;i++)	{
			if (this.anim_array[i]!==null)	{
				let anim_data=this.anim_array[i];

				anim_data.obj[anim_data.param]=anim_data.start_val+anim_data.delta*anim_data.func(anim_data.progress);
				anim_data.progress+=anim_data.speed;
				
				if (anim_data.progress>=1)	{
					anim_data.callback();
					anim_data.obj.visible=anim_data.vis_on_end;
					anim_data.obj.ready=true;
					this.anim_array[i]=null;					
				}
			}
		}
	}
	
}

function calc_projectile_parameters(t_data) {

	let dx=t_data.x1-t_data.x0;
	let dy=t_data.y1-t_data.y0;
	let v0=Math.sqrt(dx*dx+dy*dy);
	let Q=Math.atan2(dy, dx);

			
	let vy0=Math.sin(Q)*v0;
	let vx0=Math.cos(Q)*v0;	
	let t_inc=16/v0/Math.cos(Q);
	
	return {vx0,vy0,t_inc};
}

function init_game() {
	
	
	objects.bcg.pointerdown=function(e) {	
	
		touch_data.x0 = e.data.global.x/app.stage.scale.x;
		touch_data.y0 = e.data.global.y/app.stage.scale.y;	
		
		touch_data.x1 = touch_data.x0;
		touch_data.y1 = touch_data.y0;	
		
		objects.my_top.texture=game_res.resources["my_top"].texture;
		drag=1;		
		
	};	
	
	objects.bcg.pointermove=function(e) {	
			
		if (drag===1) {
			touch_data.x1 = e.data.global.x/app.stage.scale.x;
			touch_data.y1 = e.data.global.y/app.stage.scale.y;	
			update_on_drag();
		}
	};	

	objects.bcg.pointerup=function(){
		
		if (drag===0)
			return;
		
		drag=0;
		game.send_move(touch_data);
		let projectile_data=calc_projectile_parameters(touch_data);
		projectile.add(projectile_data,"opponent");
		guide_line.visible=guide_line2.visible=false;		
		anim.add(objects.my_top,'rotation',true,'linear',objects.my_top.rotation, objects.my_top.rotation+Math.PI/2,0.1, function(){
			anim.add(objects.my_top,'rotation',true,'linear',objects.my_top.rotation, 0,0.1, ()=>{
				objects.my_top.texture=game_res.resources["top_ready"].texture;
			})			
		});
		

	};	
	
	app.stage.addChild(guide_line, guide_line2);
}

function update_on_drag() {
	
	if (guide_line.visible===false)
		guide_line.visible=guide_line2.visible=true;	

	let dx=touch_data.x1-touch_data.x0;
	let dy=touch_data.y1-touch_data.y0;
	
	let v0=Math.sqrt(dx*dx+dy*dy);
	v0=Math.max(50, Math.min(v0, 120));
	
	let Q=Math.atan2(dy, dx);
	Q=Math.max(-0.785398, Math.min(Q, 0));
	
	
	//обновляем данные на основе корректированной длины
	touch_data.x1=touch_data.x0+v0*Math.cos(Q);	
	touch_data.y1=touch_data.y0+v0*Math.sin(Q);	
	
		
	objects.my_top.rotation=Q;
	
	let shift_x = objects.my_cont.x+objects.my_top.x;
	let shift_y = objects.my_cont.y;	
	
	guide_line.clear();
	guide_line.lineStyle(1, 0x00ff00)		
	guide_line.moveTo(touch_data.x0,touch_data.y0);
	guide_line.lineTo(touch_data.x1,touch_data.y1);		
	
	guide_line2.clear();
	guide_line2.lineStyle(2, 0xff0000)		
	guide_line2.moveTo(shift_x,shift_y);
	
	//вычисляем  кривую движения снаряда
	let vy0=Math.sin(Q)*v0;
	let vx0=Math.cos(Q)*v0;
	let t_inc=800/v0/Math.cos(Q)/50;	
	
	for (let i=1;i<20;i++) {			
		let t=i*t_inc;	
		guide_line2.lineTo(shift_x+i*16,shift_y+vy0*t+0.5*9.8*t*t);			
	}
	
}

function load() {
	
		
	game_res=new PIXI.Loader();	
	game_res.add("m2_font", "m_font.fnt");
	
	//добавляем из листа загрузки
	for (var i=0;i<load_list.length;i++)
		if (load_list[i][0]=="sprite" || load_list[i][0]=="image") 
			game_res.add(load_list[i][1], "res/"+load_list[i][1]+".png");
	
	
	
	result = prompt("введите ИД");

	my_data.first_name="_"+result;
	my_data.last_name='';
	my_data.uid="id"+result;
	my_data.pic_url="https://games-sdk.yandex.ru/api/sdk/v1/player/avatar/QOLKPU4YFODTRPL5OQ4WQAE6N676RI66CAYPJ7DF7V2KXISZDYLQTF44V6TINKIPEVZXO4HAA5K3TG6NKPD4WVXNLTMC47XLAYK3NMMKUDOJQYXSUDDBGLKFXWQDAGVQBFYRSBHVNAPFFJB3WDVI6AY=/islands-retina-middle"

	my_data.rating=1400;
		
	
	game_res.load(load_complete);		
	game_res.onProgress.add(progress);
	
	function resize_screen() {
		const vpw = window.innerWidth;  // Width of the viewport
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
		
	function load_complete() {
		
		document.getElementById("m_bar").outerHTML = "";		
		document.getElementById("m_progress").outerHTML = "";
		
		app = new PIXI.Application({width:M_WIDTH, height:M_HEIGHT,antialias:true,backgroundColor : 0x002200});
		document.body.appendChild(app.view);

		//информация о положении курсора мыши
		//mouse_pos=PIXI.InteractionData.global;

		resize_screen();
		window.addEventListener("resize", resize_screen);	
			
		//создаем спрайты и массивы спрайтов и запускаем первую часть кода
		for (var i=0;i<load_list.length;i++) {			
			const obj_class=load_list[i][0];
			const obj_name=load_list[i][1];

			switch(obj_class)
			{			
				case "sprite":
					objects[obj_name]=new PIXI.Sprite(game_res.resources[obj_name].texture);
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
		for (var i=0;i<load_list.length;i++) {			
			const obj_class=load_list[i][0];
			const obj_name=load_list[i][1];

			switch(obj_class)
			{			
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
						eval(load_list[i][4]);		
				break;
			}
		}


		particle_engine.init();

		//инициализация игры
		init_game();
		

		//запрашиваем мою информацию из бд или заносим в бд новые данные если игрока нет в бд
		firebase.database().ref("players/"+my_data.uid).once('value').then((snapshot) => {			
			var data=snapshot.val();
			if (snapshot.val()===null) {
				my_data.rating=1400;			  
				firebase.database().ref("players/"+my_data.uid).set({first_name:my_data.first_name, last_name: my_data.last_name, rating: my_data.rating, pic_url: my_data.pic_url});	
			}
			else {
				my_data.rating=data.rating;
				//на всякий случай обновляет данные так как могло поменяться имя или фамилия или фото
				firebase.database().ref("players/"+my_data.uid).set({first_name:my_data.first_name, last_name: my_data.last_name, rating: my_data.rating, pic_url: my_data.pic_url});	
			}			
			
			//и обновляем информацию так как считали рейтинг
			let trimmed_text=my_data.first_name+" "+my_data.last_name;
			trimmed_text = trimmed_text.length > 15 ?  trimmed_text.substring(0, 12) + "..." : trimmed_text;
			objects.player_name_text.text=trimmed_text;	
			objects.player_rating_text.text=my_data.rating;	
		});
		
		
		//обновляем мой аватар и отображаем мою карточку
		var loader2 = new PIXI.Loader();
		loader2.add('my_avatar', my_data.pic_url,{loadType: PIXI.loaders.Resource.LOAD_TYPE.IMAGE});
		loader2.load((loader, resources) => {
			objects.my_avatar.texture = resources.my_avatar.texture;
			
		});
		

		//************сетевые манипуляции********************//
		
		//записываем что мы в онлайне и простаиваем
		firebase.database().ref("states/"+my_data.uid).set("online");
		
		//обновляем почтовый ящик и подписываемся на новые сообщения
		firebase.database().ref("inbox/"+my_data.uid).set({sender:"-",message:"-",timestamp:"-",data:{}});
		firebase.database().ref("inbox/"+my_data.uid).on('value', (snapshot) => { game.process_new_message(snapshot.val());});
				
		//подписываемся на изменения состояний пользователей
		firebase.database().ref("states").on('value', (snapshot) => { game.players_list_updated(snapshot.val());});
				
		//отключение от игры
		firebase.database().ref("states/"+my_data.uid).onDisconnect().set("offline");



		//запускаем главный цикл
		main_loop(); 		
	
	}
	
	function progress(loader, resource) {
		
		document.getElementById("m_bar").style.width =  Math.round(loader.progress)+"%";
	}
	
	
	
}

function main_loop() {
	
	
	projectile.process();	
	particle_engine.process();
	
	process_collisions();
	
	//анимируем окно ожидания соперника
	if (objects.search_opponent_window.visible===true)
		objects.search_opponent_progress.rotation+=0.1;
	
	anim.process();
    app.render(app.stage);
	requestAnimationFrame(main_loop);
	game_tick+=0.01666666;
}


