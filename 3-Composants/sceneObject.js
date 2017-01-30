define([
  'components',
], (
  ComponentFactory
) => {
  'use strict';

  // # Classe *SceneObject*
  // La classe *SceneObject* représente un objet de la scène qui
  // peut contenir des enfants et des composants.
  class SceneObject {
    // ## Méthode *addComponent*
    // Cette méthode prend en paramètre le type d'un composant et
    // instancie un nouveau composant.
    addComponent(type) {
      const newComponent = ComponentFactory.create(type, this);
	  this.components.push(newComponent);
    }

    // ## Fonction *getComponent*
    // Cette fonction retourne un composant existant du type spécifié
    // associé à l'objet.
    getComponent(type) {
	  for(var i = 0; i < this.components.length; i++) {
		  var comp = this.components[i];
		  if(comp.__type == type){
			  return comp;
		  }
	  }
	  return null;
    }

    // ## Méthode *addChild*
    // La méthode *addChild* ajoute à l'objet courant un objet
    // enfant.
    addChild(objectName, child) {
      this.children.push(objectName => child);
    }

    // ## Fonction *getChild*
    // La fonction *getChild* retourne un objet existant portant le
    // nom spécifié, dont l'objet courant est le parent.
    getChild(objectName) {      
	  return this.children[objectName];
    }

    // ## Fonction *fingObjectInScene*
    // Cette fonction retourne un objet de la scène portant le
    // nom spécifié. Cet objet n'est pas nécessairement en lien
    // avec l'objet courant. Voir la méthode `findObject` de la
    // classe *Scene*.
    findObjectInScene(objectName) {
	  var current = this;
	  while(current.name != "scene"){
		  current = current.owner;
	  }
	  current.findObject(objectName);
    }
	
	findObjectInObject(objectName){
      if (this.children[objectName]) {
        return this.getChild(objectName);
      }
      var object = null;
      this.children.forEach((key, value) => {
        if (object) {
          return;
        }
        object = value.findObjectInObject(objectName);
      });
      return object;
    }

    // ## Méthode *display*
    // Cette méthode appelle la méthode *display* des composants
    // de l'objet.
    display(dT) {
      this.children.forEach((key, value) => {
        value.display(dT);
      });
	  this.components.forEach((key, value) => {
        value.display(dT);
      });
    }

    // ## Méthode *update*
    // Cette méthode appelle la méthode *update* des composants
    // de l'objet.
    update(dT) {
      this.children.forEach((key, value) => {
        value.update(dT);
      });
	  this.components.forEach((key, value) => {
        value.update(dT);
      });
    }
  }

  class PlayerObject extends SceneObject{
	  constructor(name,descr, owner){	
		  this.name = name;
		  this.owner = owner;
		  var pos = ComponentFactory.create(Position, this);
		  pos.setup(descr["components"]["Position"]);
		  var texture = ComponentFactory.create(Texture, this);
		  texture.setup(descr["components"]["Texture"]);		  
		  var joystick = ComponentFactory.create(Joystick, this);
		  joystick.setup(descr["components"]["Joystick"]);
		  var collider = ComponentFactory.create(Collider, this);
		  collider.setup(descr["components"]["Collider"]);
		  this.addComponent(pos);
		  this.addComponent(texture);
		  this.addComponent(joystick);
		  this.addComponent(collider);
		  var score = new Score(descr["children"]["score"], this);
		  this.addChild("score", score);
	  }
  }
  
  class BackgroundObject extends SceneObject{
	  constructor(name,descr, owner){
		  this.name = name;
		  this.owner = owner;
		  var pos = ComponentFactory.create(Position, this);
		  pos.setup(descr["components"]["Position"]);
		  var texture = ComponentFactory.create(Texture, this);
		  texture.setup(descr["components"]["Texture"]);
		  this.addComponent(pos);
		  this.addComponent(texture);		  
	  }
  }
  
  class RefereeObject extends SceneObject{
	  constructor(name,descr, owner){
		this.name = name;
		this.owner = owner;
		var referee = ComponentFactory.create(Referee, this);
		referee.setup(descr["components"]["Referee"]);
		this.addComponent(referee);
	  }
  }
  
  class BallObject extends SceneObject{
	  constructor(name,descr, owner){
		  this.name = name;
		  this.owner = owner;
		  var pos = ComponentFactory.create(Position, this);
		  pos.setup(descr["components"]["Position"]);
		  var texture = ComponentFactory.create(Texture, this);
		  texture.setup(descr["components"]["Texture"]);		  
		  var motion = ComponentFactory.create(Motion, this);
		  motion.setup(descr["components"]["Motion"]);
		  var collider = ComponentFactory.create(Collider, this);
		  collider.setup(descr["components"]["Collider"]);
		  this.addComponent(pos);
		  this.addComponent(texture);
		  this.addComponent(motion);
		  this.addComponent(collider);
	  }
  }
  
  class ScoreObject extends SceneObject{
	  constructor(name,descr, owner){
		  this.name = name;
		  this.owner = owner;
		  var scorePos = ComponentFactory.create(Position, this);
		  scorePos.setup(descr["components"]["Position"]);
		  var scoreText = ComponentFactory.create(Texture, this);
		  scoreText.setup(descr["components"]["Texture"]);
		  var scoreTextAtlas = ComponentFactory.create(TextureAtlas, this);
		  scoreTextAtlas.setup(descr["components"]["TextureAtlas"]);
		  var scoreScore = ComponentFactory.create(Score, this);
		  scoreScore.setup(descr["components"]["Score"]);		  
		  this.addComponent(scorePos);
		  this.addComponent(scoreText);
		  this.addComponent(scoreTextAtlas);
		  this.addComponent(scoreScore);
	  }
  }
  
  class SceneObjectFactory {
    static create(type, name, descr, owner) {
      const comp = new SceneObjectFactory.sceneObjectCreators[type](name, descr,owner);
      comp.__type = type;
      return comp;
    }
  }
  
  SceneObjectFactory.sceneObjectCreators = {
    Background: BackgroundObject,
	Ball: BallObject,
	Player: PlayerObject,
	Referee: RefereeObject,
	Score: ScoreObject
  };

  return SceneObjectFactory;
});
