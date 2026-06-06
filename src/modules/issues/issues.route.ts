import { request, Router } from "express";
import { issuController } from "./issues.controller";
import auth from "../../middleware/auth";

const router = Router()

router.post('/',auth("maintainer", "contributor"), issuController.createIssue)
router.get('/',auth("maintainer", "contributor"), issuController.getAllIssues)
router.get('/:id',auth("maintainer", "contributor"), issuController.getSingleIssue)
router.put('/:id', auth("maintainer", "contributor"), issuController.updateIssue)
router.delete('/:id',auth("maintainer"), issuController.deleteIssue)



export const issueRoute = router