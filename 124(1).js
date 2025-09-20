// Паттерн Singleton для GameManager
class GameManager {
    constructor() {
        if (GameManager.instance) {
            return GameManager.instance;
        }
        GameManager.instance = this;
        this.characters = [];
        this.battles = [];
        return this;
    }

    static getInstance() {
        if (!GameManager.instance) {
            GameManager.instance = new GameManager();
        }
        return GameManager.instance;
    }

    addCharacter(character) {
        this.characters.push(character);
    }

    addBattleLog(log) {
        this.battles.push(log);
        console.log(log);
    }
}

// Паттерн Factory для создания персонажей
class CharacterFactory {
    static createCharacter(race, equipment = {}) {
        let character;
        
        switch(race) {
            case 'orc':
                character = new Orc();
                break;
            case 'dwarf':
                character = new Dwarf();
                break;
            case 'human':
                character = new Human();
                break;
            case 'elf':
                character = new Elf();
                break;
            default:
                throw new Error('Неизвестная раса');
        }

        // Экипировка
        if (equipment.weapon) {
            character.equipWeapon(equipment.weapon);
        }
        if (equipment.armor) {
            for (const [type, armor] of Object.entries(equipment.armor)) {
                character.equipArmor(type, armor);
            }
        }

        return character;
    }
}

// Паттерн Builder для создания экипировки
class EquipmentBuilder {
    constructor(weapon, armor) {
        this.armor = []
        build(weapon, armor)
    }

    setWeapon(weapon) {
    
        return this;
    }

    addArmor(armor) {
        this.armor[armor.type] = armor;
        return this;
    }

    build(weapon, armor) {
        this.weapon = setWeapon(weapon),
        this.armor = addArmor(armor)
    }
}

// Базовый класс персонажа
class Character {
    constructor(race, height, weight, strength, health, age) {
        this.race = race;
        this.height = height;
        this.weight = weight;
        this.strength = strength;
        this.health = health;
        this.maxHealth = health;
        this.age = age;
        this.armor = {
            chest: null,
            helmet: null,
            leggings: null,
            pants: null
        };
        this.weapon = null;
        this.isAlive = true;
    }

    equipArmor(armorType, armor) {
        if (this.armor.hasOwnProperty(armorType)) {
            this.armor[armorType] = armor;
        }
    }

    equipWeapon(weapon) {
        this.weapon = weapon;
    }

    getTotalArmor() {
        let total = 0;
        for (const type in this.armor) {
            if (this.armor[type]) {
                total += this.armor[type].defense;
            }
        }
        return total;
    }

    attack(target) {
        if (!this.isAlive || !target.isAlive) return;

        const baseDamage = this.strength + (this.weapon ? this.weapon.damage : 5);
        const targetArmor = target.getTotalArmor();
        const actualDamage = Math.max(1, baseDamage - targetArmor);
        
        target.health -= actualDamage;
        
        const game = GameManager.getInstance();
        game.addBattleLog(`${this.race} атакует ${target.race} (${actualDamage} урона)`);
        
        if (target.health <= 0) {
            target.health = 0;
            target.isAlive = false;
            game.addBattleLog(`⚰️ ${target.race} погиб!`);
        }
    }

    restoreHealth() {
        this.health = this.maxHealth;
        this.isAlive = true;
    }
}

// Классы рас
class Orc extends Character {
    constructor() {
        super("Орк", 210, 120, 18, 100, 35);
    }
}

class Dwarf extends Character {
    constructor() {
        super("Гном", 140, 80, 16, 90, 150);
    }
}

class Human extends Character {
    constructor() {
        super("Человек", 180, 85, 15, 85, 30);
    }
}

class Elf extends Character {
    constructor() {
        super("Эльф", 190, 75, 14, 80, 200);
    }
}

// Классы брони и оружия
class Armor {
    constructor(name, defense) {
        this.name = name;
        this.defense = defense;
    }
}

class Weapon {
    constructor(name, damage) {
        this.name = name;
        this.damage = damage;
    }
}

// Сеттинг игры
class GameSetting {
    static setupGame() {
        const game = GameManager.getInstance();
        
        // Создаем экипировку через Builder
        const builder = new EquipmentBuilder();
        
        const orcEquipment = builder
            .setWeapon(new Weapon("Топор", 14))
            .addArmor("chest", new Armor("Латный доспех", 15))
            .addArmor("helmet", new Armor("Стальной шлем", 8))
            .build();

        const dwarfEquipment = builder
            .setWeapon(new Weapon("Алебарда", 15))
            .addArmor("chest", new Armor("Кольчуга", 10))
            .addArmor("leggings", new Armor("Железные поножи", 12))
            .build();

        const humanEquipment = builder
            .setWeapon(new Weapon("Меч", 12))
            .addArmor("chest", new Armor("Кольчуга", 10))
            .addArmor("pants", new Armor("Кожаные штаны", 5))
            .build();

        const elfEquipment = builder
            .setWeapon(new Weapon("Лук", 11))
            .addArmor("pants", new Armor("Кожаные штаны", 5))
            .build();

        // Создаем персонажей через Factory
        const orc = CharacterFactory.createCharacter('orc', orcEquipment);
        const dwarf = CharacterFactory.createCharacter('dwarf', dwarfEquipment);
        const human = CharacterFactory.createCharacter('human', humanEquipment);
        const elf = CharacterFactory.createCharacter('elf', elfEquipment);

        game.addCharacter(orc);
        game.addCharacter(dwarf);
        game.addCharacter(human);
        game.addCharacter(elf);

        return [orc, dwarf, human, elf];
    }
}

// Функции боя
function fight(character1, character2) {
    const game = GameManager.getInstance();
    game.addBattleLog(`\n⚔️ БОЙ: ${character1.race} vs ${character2.race}`);
    
    let round = 1;
    while (character1.isAlive && character2.isAlive && round <= 10) {
        game.addBattleLog(`Раунд ${round}`);
        
        character1.attack(character2);
        if (!character2.isAlive) break;
        
        character2.attack(character1);
        if (!character1.isAlive) break;
        
        round++;
    }

    if (character1.isAlive) {
        game.addBattleLog(`Победил: ${character1.race}`);
        return character1;
    } else {
        game.addBattleLog(`Победил: ${character2.race}`);
        return character2;
    }
}

function tournament() {
    const game = GameManager.getInstance();
    game.addBattleLog("🏆 ТУРНИР НАЧАЛСЯ!");
    
    const results = {};
    const characters = game.characters;
    
    for (let i = 0; i < characters.length; i++) {
        for (let j = i + 1; j < characters.length; j++) {
            characters[i].restoreHealth();
            characters[j].restoreHealth();
            
            const winner = fight(characters[i], characters[j]);
            results[winner.race] = (results[winner.race] || 0) + 1;
        }
    }
    
    game.addBattleLog("\n📊 РЕЗУЛЬТАТЫ:");
    for (const [race, wins] of Object.entries(results)) {
        game.addBattleLog(`${race}: ${wins} побед`);
    }
}

// Запуск игры
function main() {
    console.log("🎮 ЗАПУСК ИГРЫ...");
    
    // Подготовка сеттинга
    const characters = GameSetting.setupGame();
    const game = GameManager.getInstance();
    
    // Запуск турнира
    tournament();
    
    console.log("\n🎯 ИГРА ЗАВЕРШЕНА!");
}

// Запускаем игру
main();