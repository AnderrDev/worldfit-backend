import { Router } from 'express';
import { RoleAdapter } from '../adapter/role.adapter';
import { RoleApplication } from '../../application/role.application';
import { RoleController } from '../controller/role.controller';
import { authenticateToken, requireAdmin } from '../web/auth.middleware';

const router = Router();

const roleAdapter = new RoleAdapter();
const roleApplication = new RoleApplication(roleAdapter);
const roleController = new RoleController(roleApplication);

router.get('/roles', authenticateToken, (req, res) => roleController.getAllRoles(req, res));
router.get('/roles/:id', authenticateToken, (req, res) => roleController.getRoleById(req, res));

router.post('/roles', authenticateToken, requireAdmin, (req, res) => roleController.createRole(req, res));
router.put('/roles/:id', authenticateToken, requireAdmin, (req, res) => roleController.updateRole(req, res));
router.delete('/roles/:id', authenticateToken, requireAdmin, (req, res) => roleController.deleteRole(req, res));

export default router;
