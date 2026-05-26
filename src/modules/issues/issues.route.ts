import { request, Router } from "express";
import { issuController } from "./issues.controller";

const router = Router()

router.post('/', issuController.createIssue)
router.get('/', issuController.getAllIssues)




export const issueRoute = router