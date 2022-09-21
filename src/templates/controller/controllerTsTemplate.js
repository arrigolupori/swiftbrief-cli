module.exports = `import { catchAsyncErrors } from 'server/middleware'
import { NextApiRequest, NextApiResponse } from 'next'

export const createSupportRequest = catchAsyncErrors(
	async (req: NextApiRequest, res: NextApiResponse) => {
        const { ... } = req.body
        // Controller methods
        const templateNameData = async () => null
        res.status(200).json({
			status: 'success',
			data: { templateNameData }
		})
    }
`
