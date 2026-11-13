/** Données de parcours maintenues en JSON, et non dans le code du jeu. */
import courseData from './lumumba-course-v1.json' with { type: 'json' };

export const avenueLumumbaCourse = courseData;
export const avenueLumumbaRoute = courseData.route;
