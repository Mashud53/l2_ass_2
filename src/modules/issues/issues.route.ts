import { request, Router } from "express";
import { issuController } from "./issues.controller";

const router = Router()

router.post('/', issuController.createIssue)
router.get('/', issuController.getAllIssues)
router.get('/:id', issuController.getSingleIssue)
router.put('/:id', issuController.updateIssue)



export const issueRoute = router