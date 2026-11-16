window.GLUPLANDIA_RACES = [
  {
    "id": "human",
    "name": "Humano",
    "color": "#e5c991",
    "role": "Versatilidad",
    "title": "Tu curiosidad marca el rumbo.",
    "description": "Cada camino es una posibilidad. El linaje humano aprende con facilidad y encuentra su lugar tanto en una expedición como en el taller.",
    "caption": "La libertad de aprender",
    "image": "assets/race-human.png?v=final-r6",
    "stats": [
      {
        "id": "GLOBAL_EXP_GAIN",
        "value": 0.04,
        "label": "EXP de todas las habilidades",
        "display": "+4%",
        "penalty": false,
        "unit": "porcentaje"
      },
      {
        "id": "COOLDOWN_REDUCTION",
        "value": 0.04,
        "label": "Reducción de enfriamientos",
        "display": "+4%",
        "penalty": false,
        "unit": "porcentaje"
      },
      {
        "id": "CRAFTING_TIME_REDUCTION",
        "value": 0.05,
        "label": "Reducción del tiempo de fabricación",
        "display": "+5%",
        "penalty": false,
        "unit": "porcentaje"
      }
    ]
  },
  {
    "id": "dwarf",
    "name": "Enano",
    "color": "#e2a05e",
    "role": "Oficio y resistencia",
    "title": "Lo que forjas también habla de ti.",
    "description": "La roca y el metal son parte de tu historia. Un linaje firme para explorar las profundidades y transformar tus materiales en equipo.",
    "caption": "La paciencia de la piedra",
    "image": "assets/race-dwarf.png?v=final-r6",
    "stats": [
      {
        "id": "MINING_EXP_GAIN",
        "value": 0.07,
        "label": "EXP de Minería",
        "display": "+7%",
        "penalty": false,
        "unit": "porcentaje"
      },
      {
        "id": "SMITHING_EXP_GAIN_GENERAL",
        "value": 0.07,
        "label": "EXP de Herrería",
        "display": "+7%",
        "penalty": false,
        "unit": "porcentaje"
      },
      {
        "id": "EXPLOSION_RESISTANCE",
        "value": 0.1,
        "label": "Resistencia a explosiones",
        "display": "+10%",
        "penalty": false,
        "unit": "porcentaje"
      },
      {
        "id": "HEALTH_BONUS",
        "value": 2,
        "label": "Salud máxima",
        "display": "+2",
        "penalty": false,
        "unit": "puntos de salud"
      },
      {
        "id": "MOVEMENT_SPEED_BONUS",
        "value": -0.035,
        "label": "Velocidad de movimiento",
        "display": "−3,5%",
        "penalty": true,
        "unit": "porcentaje"
      }
    ]
  },
  {
    "id": "elf",
    "name": "Elfo",
    "color": "#8bd6bf",
    "role": "Precisión y movilidad",
    "title": "Cada paso tiene una intención.",
    "description": "La precisión exige paciencia. El linaje élfico conecta la arquería con el conocimiento de los encantamientos y la libertad de moverse con agilidad.",
    "caption": "El camino entre las hojas",
    "image": "assets/race-elf.png?v=final-r6",
    "stats": [
      {
        "id": "ENCHANTING_EXP_GAIN",
        "value": 0.07,
        "label": "EXP de Encantamiento",
        "display": "+7%",
        "penalty": false,
        "unit": "porcentaje"
      },
      {
        "id": "ARCHERY_EXP_GAIN",
        "value": 0.07,
        "label": "EXP de Arquería",
        "display": "+7%",
        "penalty": false,
        "unit": "porcentaje"
      },
      {
        "id": "MAGIC_RESISTANCE",
        "value": 0.1,
        "label": "Resistencia mágica",
        "display": "+10%",
        "penalty": false,
        "unit": "porcentaje"
      },
      {
        "id": "MOVEMENT_SPEED_BONUS",
        "value": 0.035,
        "label": "Velocidad de movimiento",
        "display": "+3,5%",
        "penalty": false,
        "unit": "porcentaje"
      },
      {
        "id": "HEALTH_BONUS",
        "value": -2,
        "label": "Salud máxima",
        "display": "−2",
        "penalty": true,
        "unit": "puntos de salud"
      }
    ]
  },
  {
    "id": "orc",
    "name": "Orco",
    "color": "#c3cf86",
    "role": "Fuerza y presencia",
    "title": "El primer golpe cambia el encuentro.",
    "description": "Tu fortaleza se expresa en el combate cercano. Las armas pesadas encuentran su lugar en un linaje preparado para resistir el choque frontal.",
    "caption": "La fuerza de permanecer",
    "image": "assets/race-orc.png?v=final-r6",
    "stats": [
      {
        "id": "HEAVY_WEAPONS_EXP_GAIN",
        "value": 0.07,
        "label": "EXP de armas pesadas",
        "display": "+7%",
        "penalty": false,
        "unit": "porcentaje"
      },
      {
        "id": "MELEE_DAMAGE_DEALT",
        "value": 0.025,
        "label": "Daño cuerpo a cuerpo",
        "display": "+2,5%",
        "penalty": false,
        "unit": "porcentaje"
      },
      {
        "id": "KNOCKBACK_RESISTANCE",
        "value": 0.08,
        "label": "Resistencia al retroceso",
        "display": "+8%",
        "penalty": false,
        "unit": "porcentaje"
      },
      {
        "id": "HEALTH_BONUS",
        "value": 2,
        "label": "Salud máxima",
        "display": "+2",
        "penalty": false,
        "unit": "puntos de salud"
      },
      {
        "id": "RANGED_INACCURACY",
        "value": 1.0,
        "label": "Imprecisión a distancia",
        "display": "+1",
        "penalty": true,
        "unit": "unidad de imprecisión"
      }
    ]
  },
  {
    "id": "halfling",
    "name": "Mediano",
    "color": "#a4d590",
    "role": "Ingenio y vida al aire libre",
    "title": "Las pequeñas rutas también llevan lejos.",
    "description": "Entre los cultivos y la orilla del río hay mucho que aprender. Un linaje ligero para quienes hacen de los recursos cotidianos el comienzo de su aventura.",
    "caption": "La aventura cotidiana",
    "image": "assets/race-halfling.png?v=final-r6",
    "stats": [
      {
        "id": "FARMING_EXP_GAIN",
        "value": 0.07,
        "label": "EXP de Agricultura",
        "display": "+7%",
        "penalty": false,
        "unit": "porcentaje"
      },
      {
        "id": "FISHING_EXP_GAIN",
        "value": 0.07,
        "label": "EXP de Pesca",
        "display": "+7%",
        "penalty": false,
        "unit": "porcentaje"
      },
      {
        "id": "FALLING_RESISTANCE",
        "value": 0.12,
        "label": "Resistencia a caídas",
        "display": "+12%",
        "penalty": false,
        "unit": "porcentaje"
      },
      {
        "id": "MOVEMENT_SPEED_BONUS",
        "value": 0.025,
        "label": "Velocidad de movimiento",
        "display": "+2,5%",
        "penalty": false,
        "unit": "porcentaje"
      },
      {
        "id": "HEALTH_BONUS",
        "value": -2,
        "label": "Salud máxima",
        "display": "−2",
        "penalty": true,
        "unit": "puntos de salud"
      }
    ]
  }
];
