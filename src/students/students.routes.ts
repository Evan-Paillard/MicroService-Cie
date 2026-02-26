import { Router, Request, Response } from 'express';
import {
    createStudent,
    deleteStudent,
    studentsbydomain,
    studentsbyid,
    updateStudent
} from './students.repository';

// Création du routeur Express
export const studentsRouter = Router();

// POST / - Créer un nouvel étudiant
studentsRouter.post('/', async (req: Request, res: Response) => {
    try {
        const student = await createStudent(req.body);
        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de l\'étudiant' });
    }
});

// GET /:id - Récupérer un étudiant par son ID
studentsRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);
        const student = await studentsbyid(id);
        if (student) {
            res.json(student);
        } else {
            res.status(404).json({ error: 'Étudiant non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// GET /domain/:domain - Récupérer les étudiants par domaine
studentsRouter.get('/domain/:domain', async (req: Request, res: Response) => {
    try {
        const students = await studentsbydomain(req.params.domain as string);
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// PUT /:id - Mettre à jour un étudiant
studentsRouter.put('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);
        const student = await updateStudent(id, req.body);
        res.json(student);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
});

// DELETE /:id - Supprimer un étudiant
studentsRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);
        await deleteStudent(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
});