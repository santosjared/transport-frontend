import { useState, useEffect } from 'react';
import { useService } from 'src/hooks/useService';

interface Path {
  title: string;
  path: string;
  icon: string;
}

const usePaths = () => {
  const [rules, setRules] = useState<string[]>([]);
  const { Get } = useService();

  useEffect(() => {
    const fetch = async () => {
      const response = await Get('/auth');
      if (response.data && response.data.access) {
        setRules(response.data.access);
      }
    };
    fetch();
  }, []);

  const paths: Path[] = [];

  rules.forEach((rule: any) => {
    switch (rule.name) {
      case 'Listar-monitoreo':
        paths.push({
          title: 'Monitoreo',
          path: '/minibus/monitoreo',
          icon: 'eos-icons:monitoring',
        });
        break;
      case 'Listar-usuarios':
        paths.push({
          title: 'Registro de usuarios',
          path: '/minibus/users',
          icon: 'mdi:users',
        });
        break;
      case 'Listar-rol':
        paths.push({
          title: 'Roles y Permiso',
          path: '/minibus/rol',
          icon: 'carbon:user-role',
        });
        break;
      case 'Listar-microbus':
        paths.push({
          title: 'Registro de microbuses',
          path: '/minibus/bus',
          icon: 'mdi:bus',
        });
        break;
      case 'Listar-tarifa':
        paths.push({
          title: 'Registro de tarifas',
          path: '/minibus/tarifas',
          icon: 'fluent:money-hand-20-regular',
        });
        break;
      case 'Listar-horario':
        paths.push({
          title: 'Registro de horarios',
          path: '/minibus/horario',
          icon: 'game-icons:notebook',
        });
        break;
      case 'Listar-ruta':
        paths.push({
          title: 'Registro de rutas',
          path: '/minibus/road',
          icon: 'material-symbols:fork-right',
        });
        break;
      case 'Listar-linea':
        paths.push({
          title: 'Registro de lineas',
          path: '/minibus/lineas',
          icon: 'tabler:list-letters',
        });
        break;
      default:
        break;
    }
  });

  return paths;
};

export default usePaths;
