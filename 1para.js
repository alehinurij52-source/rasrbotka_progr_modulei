// Базовый класс для всех рас
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

    // Надеть броню
    equipArmor(armorType, armor) {
        if (this.armor.hasOwnProperty(armorType)) {
            this.armor[armorType] = armor;
            console.log(`${this.race} надел ${armorType}: ${armor.name}`);
        } else {
            console.log(`Неверный тип брони: ${armorType}`);
        }
    }

    // Взять оружие
    equipWeapon(weapon) {
        this.weapon = weapon;
        console.log(`${this.race} взял в руки: ${weapon.name}`);
    }

    // Получить общую защиту от всей брони
    getTotalArmor() {
        let total = 0;
        for (const type in this.armor) {
            if (this.armor[type]) {
                total += this.armor[type].defense;
            }
        }
        return total;
    }

    // Атаковать другого персонажа
    attack(target) {
        if (!this.isAlive || !target.isAlive) return;

        const baseDamage = this.strength + (this.weapon ? this.weapon.damage : 5);
        const targetArmor = target.getTotalArmor();
        const actualDamage = Math.max(1, baseDamage - targetArmor);
        
        target.health -= actualDamage;
        
        console.log(`${this.race} атакует ${target.race} с силой ${actualDamage} урона!`);
        console.log(`${target.race} получает ${actualDamage} урона. Здоровье: ${target.health}/${target.maxHealth}`);
        
        if (target.health <= 0) {
            target.health = 0;
            target.isAlive = false;
            console.log(`⚰️ ${target.race} погиб!`);
        }
    }

    // Восстановить здоровье для нового боя
    restoreHealth() {
        this.health = this.maxHealth;
        this.isAlive = true;
    }

    getStatus() {
        return `${this.race} [${this.health}/${this.maxHealth} HP]`;
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

// Классы брони
class Armor {
    constructor(name, defense, type) {
        this.name = name;
        this.defense = defense;
        this.type = type;
    }
}

// Классы оружия
class Weapon {
    constructor(name, damage, type) {
        this.name = name;
        this.damage = damage;
        this.type = type;
    }
}

// Создание экземпляров брони
const plateArmor = new Armor("Латный доспех", 15, "chest");
const chainArmor = new Armor("Кольчуга", 10, "chest");
const steelHelmet = new Armor("Стальной шлем", 8, "helmet");
const ironLeggings = new Armor("Железные поножи", 12, "leggings");
const leatherPants = new Armor("Кожаные штаны", 5, "pants");

// Создание экземпляров оружия
const sword = new Weapon("Меч", 12, "sword");
const halberd = new Weapon("Алебарда", 15, "halberd");
const axe = new Weapon("Топор", 14, "axe");
const bow = new Weapon("Лук", 11, "bow");

// Функция для проведения боя между двумя персонажами
function fight(character1, character2) {
    console.log(`\n⚔️  НАЧИНАЕТСЯ БОЙ: ${character1.race} vs ${character2.race}`);
    console.log("=".repeat(50));
    
    let round = 1;
    
    while (character1.isAlive && character2.isAlive && round <= 20) {
        console.log(`\n--- Раунд ${round} ---`);
        
        // Первый атакует второго
        character1.attack(character2);
        if (!character2.isAlive) break;
        
        // Второй атакует первого
        character2.attack(character1);
        if (!character1.isAlive) break;
        
        round++;
    }
    
    if (character1.isAlive && character2.isAlive) {
        console.log("\nБой окончился ничьей!");
    } else if (character1.isAlive) {
        console.log(`\n🎉 ПОБЕДИТЕЛЬ: ${character1.race}`);
    } else {
        console.log(`\n🎉 ПОБЕДИТЕЛЬ: ${character2.race}`);
    }
}

// Функция для турнира (каждый с каждым)
function tournament(characters) {
    console.log("🏆 НАЧИНАЕТСЯ ТУРНИР!");
    console.log("=".repeat(50));
    
    const results = {};
    characters.forEach(char => results[char.race] = 0);
    
    for (let i = 0; i < characters.length; i++) {
        for (let j = i + 1; j < characters.length; j++) {
            const char1 = characters[i];
            const char2 = characters[j];
            
            // Восстанавливаем здоровье перед каждым боем
            char1.restoreHealth();
            char2.restoreHealth();
            
            fight(char1, char2);
            
            // Записываем результаты
            if (char1.isAlive) results[char1.race]++;
            if (char2.isAlive) results[char2.race]++;
        }
    }
    
    console.log("\n🏆 РЕЗУЛЬТАТЫ ТУРНИРА:");
    console.log("=".repeat(30));
    for (const [race, wins] of Object.entries(results)) {
        console.log(`${race}: ${wins} побед`);
    }
}

// Функция для последовательного боя
function sequentialBattle(characters) {
    console.log("\n⚔️  ПОСЛЕДОВАТЕЛЬНЫЙ БОЙ:");
    console.log("=".repeat(50));
    
    // Восстанавливаем здоровье всем
    characters.forEach(char => char.restoreHealth());
    
    let currentFighter = characters[0];
    
    for (let i = 1; i < characters.length; i++) {
        if (!currentFighter.isAlive) {
            console.log("Бой окончен - нет живых бойцов!");
            break;
        }
        
        const nextFighter = characters[i];
        nextFighter.restoreHealth(); // Восстанавливаем здоровье следующему бойцу
        
        console.log(`\n⚔️  Следующий бой: ${currentFighter.race} vs ${nextFighter.race}`);
        fight(currentFighter, nextFighter);
        
        // Победитель продолжает бой
        if (currentFighter.isAlive) {
            console.log(`${currentFighter.race} продолжает бой!`);
        } else if (nextFighter.isAlive) {
            currentFighter = nextFighter;
            console.log(`${nextFighter.race} становится новым чемпионом!`);
        }
    }
    
    if (currentFighter.isAlive) {
        console.log(`\n👑 ФИНАЛЬНЫЙ ПОБЕДИТЕЛЬ: ${currentFighter.race}`);
    }
}

// Создание персонажей
const orc = new Orc();
const dwarf = new Dwarf();
const human = new Human();
const elf = new Elf();

// Экипируем персонажей
orc.equipArmor("chest", plateArmor);
orc.equipArmor("helmet", steelHelmet);
orc.equipWeapon(axe);

dwarf.equipArmor("chest", chainArmor);
dwarf.equipArmor("leggings", ironLeggings);
dwarf.equipWeapon(halberd);

human.equipArmor("chest", chainArmor);
human.equipArmor("pants", leatherPants);
human.equipWeapon(sword);

elf.equipArmor("pants", leatherPants);
elf.equipWeapon(bow);

// Запускаем турнир (каждый с каждым)
const allCharacters = [orc, dwarf, human, elf];
tournament(allCharacters);

// Запускаем последовательный бой
sequentialBattle(allCharacters);
