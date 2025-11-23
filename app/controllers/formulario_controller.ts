import type { HttpContext } from '@adonisjs/core/http'

import Profesor from '#models/profesor'
import Participante from '#models/participante'

export default class FormularioController {
  async show({ view, auth }: HttpContext) {
    const profesores = await Profesor.all()
    const user = auth.getUserOrFail()
    const hasVoted = !!user.votoParticipanteId

    return view.render('pages/formulario', { profesores, hasVoted })
  }

  async store({ request, response, session, view, auth }: HttpContext) {
    const { curso, profesor: profesorId } = request.all()
    const user = auth.getUserOrFail()


    const profesor = await Profesor.find(profesorId)

    if (!profesor) {
      session.flash('error', 'Profesor no válido.')
      return response.redirect().back()
    }

    // Verificar si el usuario ya votó
    if (user.votoParticipanteId) {
      session.flash('error', 'Ya has emitido tu voto.')
      return response.redirect().back()
    }

    // Incrementamos voto en la tabla participantes (ya que comparten ID)
    const participante = await Participante.find(profesor.id)
    if (participante) {
      participante.numero_votos += 1
      await participante.save()
    }

    // Actualizar el usuario con su voto
    user.curso = curso
    user.votoParticipanteId = profesor.id
    user.mensaje = request.input('mensaje')
    await user.save()

    session.flash('votedFor', participante ? participante.nombreCompleto : 'Candidato')

    return view.render('pages/gracias')
  }
}
