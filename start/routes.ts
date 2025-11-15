/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'


router.on('/').render('pages/home')
router.on('/gracias').render('pages/gracias')

router.get('/votacion', [() => import('#controllers/formulario_controller') , 'show'])
router.post('/votacion', [() => import('#controllers/formulario_controller') , 'store'])
