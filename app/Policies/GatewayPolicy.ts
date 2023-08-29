import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Role from 'Contracts/constant/role'

export default class GatewayPolicy extends BasePolicy {
	public async view(user: User) {
		return [Role.SUPERADMIN, Role.ADMIN, Role.USER].includes(user.roleId)
	}

	public async store(user: User) {
		return [Role.SUPERADMIN].includes(user.roleId)
	}

	public async update(user: User) {
		return [Role.SUPERADMIN, Role.ADMIN].includes(user.roleId)
	}

	public async destroy(user: User) {
		return [Role.SUPERADMIN].includes(user.roleId)
	}
}
