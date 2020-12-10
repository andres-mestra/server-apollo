import { UserInputError } from 'apollo-server-express'
import { Op } from 'sequelize';
export function unique(array) {
  return [... new Set(array)]
}
export function addUnique(array, v) {
  return unique([...array, v]);
}

export function parentPaginate(pages) {
  let page = {};
  if (pages) {
    if (pages.before && pages.after) {
      throw new UserInputError("No se admite los inputs berofe y after juntos", {
        invalidArgs: ['before', 'after']
      });
    }

    const where = pages.before ? { id: { [Op.lt]: pages.before } } :
                  pages.after ? { id: { [Op.gt]: pages.after } } : {};

    page = {
      where: where ?? undefined,
      limit: pages?.take,
      order: pages.orderBy ? [[pages.orderBy.by ?? 'id', pages.orderBy.order]] : null,
    }
  }
  return page;
}

export function childPaginate(pages){
	let page = {};
	if(pages){
		page = {
		  limit: pages?.take,
		  order: pages.orderBy ? [[pages.orderBy.by ?? 'id', pages.orderBy.order]] : null,
		}
	}
	return page;
}

export function pageInfo(first,last){
	if(first && last){
		return {
			pageInfo :{
				start: first.id,
			    end: last.id
			}
		}
	}
	
	return {};
} 

