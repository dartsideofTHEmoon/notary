import {HttpException, HttpStatus, Injectable, Logger} from "@nestjs/common"
import {FabricService} from "../fabric/fabric.service"
import {UNIVERSITY_CERTIFICATE, UniversityCertificateAbi} from "./certificate.contract"

@Injectable()
export class CertificateService {

    private readonly logger = new Logger(CertificateService.name)

    constructor(
        private readonly fabricService: FabricService
    ) {
    }

    async listCertificateProposals() {
        try {
            const gateway = await this.fabricService.connectAsIdentity('notary2@example.com')
            const network = await gateway.getNetwork('mychannel')

            const contract = network.getContract(UNIVERSITY_CERTIFICATE)
            const certificateProposals = await contract.evaluateTransaction(UniversityCertificateAbi.queryCertificateProposals)

            const parsedCertificateProposals = JSON.parse(certificateProposals.toString('utf8'))

            await this.fabricService.closeConnection()

            return parsedCertificateProposals

        } catch (e) {
            this.logger.error(e.message)
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async attestCertificate() {
        try {
            const gateway = await this.fabricService.connectAsIdentity('notary2@example.com')
            const network = await gateway.getNetwork('mychannel')

            const contract = network.getContract(UNIVERSITY_CERTIFICATE)
            const certificateProposals = await contract.submitTransaction(UniversityCertificateAbi.attestCertificate, 'certProposal10', 'cert1')
            console.log(certificateProposals)
            const parsedCertificateProposals = JSON.parse(certificateProposals.toString())
            console.log(parsedCertificateProposals, "dwa")
            await this.fabricService.closeConnection()
            return parsedCertificateProposals

        } catch (e) {
            this.logger.error(e.message)
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
