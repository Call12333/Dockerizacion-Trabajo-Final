/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Lock, 
  LogOut, 
  User as UserIcon, 
  Activity, 
  Globe,
  Cpu,
  Terminal,
  Server,
  Edit,
  Plus,
  Trash2,
  Save,
  X,
  Wifi,
  Database,
  HardDrive,
  Monitor,
  Smartphone,
  Radio,
  Key
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Y2KBackground } from './components/Y2KBackground';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [editingService, setEditingService] = useState<any>(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const [newService, setNewService] = useState({ title: '', description: '', icon: 'Shield' });
  
  // Form states
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const AVAILABLE_ICONS = [
    { name: 'Shield', icon: Shield },
    { name: 'Server', icon: Server },
    { name: 'Lock', icon: Lock },
    { name: 'Globe', icon: Globe },
    { name: 'Cpu', icon: Cpu },
    { name: 'Activity', icon: Activity },
    { name: 'Wifi', icon: Wifi },
    { name: 'Database', icon: Database },
    { name: 'HardDrive', icon: HardDrive },
    { name: 'Monitor', icon: Monitor },
    { name: 'Smartphone', icon: Smartphone },
    { name: 'Radio', icon: Radio },
  ];

  const IconRenderer = ({ name, className }: { name: string, className?: string }) => {
    const iconObj = AVAILABLE_ICONS.find(i => i.name === name);
    const IconComponent = iconObj ? iconObj.icon : Shield;
    return <IconComponent className={className} />;
  };

  const getSecurityAdvice = (iconName: string) => {
    switch (iconName) {
      case 'Shield':
        return {
          rec: "Habilitar EDR (Endpoint Detection and Response) para análisis de comportamiento.",
          sec: "Cifrado de disco AES-256 habilitado y parches de SO automatizados."
        };
      case 'Lock':
        return {
          rec: "Configurar reglas de 'deny-all' y abrir solo puertos estrictamente necesarios.",
          sec: "Inspección profunda de paquetes (DPI) y protección contra ataques de fuerza bruta."
        };
      case 'Server':
        return {
          rec: "Deshabilitar servicios innecesarios y limitar el acceso root al sistema central.",
          sec: "Monitoreo de integridad de archivos y autenticación mediante llaves SSH."
        };
      case 'Database':
        return {
          rec: "Implementar copias de seguridad incrementales cifradas en una ubicación off-site.",
          sec: "Cifrado en reposo (TDE) y auditoría de accesos privilegios activada."
        };
      case 'Globe':
        return {
          rec: "Utilizar redes CDNs con protección WAF para mitigar inyecciones maliciosas.",
          sec: "Implementación estricta de TLS 1.3 y cabeceras de seguridad HSTS."
        };
      default:
        return {
          rec: "Vigilancia constante de logs de tráfico y rotación trimestral de llaves del nodo.",
          sec: "Protocolo de respuesta ante incidentes (IRP) en modo activo."
        };
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        fetchData();
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = () => {
    fetchServices();
    fetchLogs();
  };

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      }
    } catch (error) {
      console.error("Fetch services failed:", error);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/logs', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (error) {
      console.error("Fetch logs failed:", error);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = authMode === 'login' ? '/api/login' : '/api/register';
    const body = authMode === 'login' 
      ? { email, password } 
      : { email, password, displayName };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include'
      });

      const data = await res.json();

      if (res.ok) {
        if (authMode === 'login') {
          setUser(data.user);
          fetchData();
          toast.success("Acceso Concedido", { description: "Bienvenido al Portal CyberBlue." });
        } else {
          setAuthMode('login');
          toast.success("Registro Exitoso", { description: "Ahora puedes iniciar sesión." });
        }
      } else {
        toast.error("Error", { description: data.message || "Ocurrió un error." });
      }
    } catch (error) {
      toast.error("Error de Conexión", { description: "No se pudo contactar con el servidor." });
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { credentials: 'include' });
      setUser(null);
      toast.info("Sesión Finalizada", { description: "Has salido del sistema." });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSaveService = async (id: number, data: any) => {
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      if (res.ok) {
        setEditingService(null);
        fetchServices();
        toast.success("Servicio Actualizado");
      }
    } catch (error) {
      toast.error("Error al actualizar");
    }
  };

  const handleAddService = async () => {
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newService),
        credentials: 'include'
      });
      if (res.ok) {
        setIsAddingService(false);
        setNewService({ title: '', description: '', icon: 'Shield' });
        fetchServices();
        toast.success("Servicio Añadido");
      }
    } catch (error) {
      toast.error("Error al añadir");
    }
  };

  const handleDeleteService = async (id: number) => {
    try {
      const res = await fetch(`/api/services/${id}`, { 
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        fetchServices();
        toast.info("Servicio Eliminado");
      }
    } catch (error) {
      toast.error("Error al eliminar");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-200">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
          <Cpu className="h-12 w-12 text-sky-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Y2KBackground />
      <Toaster position="top-center" />
      
      <div className="container mx-auto min-h-screen px-4 py-8">
        <header className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row">
          <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-3">
            <div className="y2k-glossy rounded-xl p-3">
              <Shield className="h-8 w-8 text-sky-600 sea-blue-glow" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-gray-800 uppercase italic">
                CyberBlue <span className="text-sky-600">Security</span>
              </h1>
              <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">v2.0.04 // Secure Data Node</p>
            </div>
          </motion.div>

          {user && (
            <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-700">{user.displayName}</p>
                <p className="text-xs font-mono text-sky-600 uppercase">{user.role}</p>
              </div>
              <Button variant="outline" onClick={handleLogout} className="y2k-glass border-red-200 text-red-600 hover:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" /> Salir
              </Button>
            </motion.div>
          )}
        </header>

        <main>
          <AnimatePresence mode="wait">
            {!user ? (
              <motion.div key="login" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.1, opacity: 0 }} className="flex justify-center">
                <Card className="w-full max-w-md y2k-glass overflow-hidden border-sky-200">
                  <div className="h-2 bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-400" />
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100">
                      <Lock className="h-8 w-8 text-sky-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold italic uppercase tracking-tight">
                      {authMode === 'login' ? 'Acceso Restringido' : 'Registro de Nodo'}
                    </CardTitle>
                    <CardDescription className="text-gray-600 font-medium">
                      {authMode === 'login' 
                        ? 'Portal avanzado de gestión de seguridad en la nube.' 
                        : 'Crea una nueva identidad en el sistema CyberBlue.'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-8">
                    <form onSubmit={handleAuth} className="space-y-4">
                      {authMode === 'register' && (
                        <div className="space-y-2">
                          <Label className="text-xs uppercase font-mono">Nombre de Operador</Label>
                          <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} required placeholder="Ej: Admin_01" className="bg-white/50" />
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label className="text-xs uppercase font-mono">Email de Red</Label>
                        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="operador@cyberblue.com" className="bg-white/50" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs uppercase font-mono">Código de Acceso</Label>
                        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="bg-white/50" />
                      </div>
                      <Button type="submit" className="w-full y2k-button h-12 text-lg font-bold uppercase tracking-wide mt-4">
                        {authMode === 'login' ? <Globe className="mr-2 h-5 w-5" /> : <Key className="mr-2 h-5 w-5" />}
                        {authMode === 'login' ? 'Entrar al Sistema' : 'Registrar Nodo'}
                      </Button>
                    </form>
                    
                    <div className="mt-4 text-center">
                      <button 
                        onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                        className="text-xs text-sky-600 hover:underline font-mono uppercase"
                      >
                        {authMode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
                      </button>
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-mono text-gray-400 uppercase">
                      <Activity className="h-3 w-3" /> Cloud Security Protocol Active
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                  <div className="y2k-glass p-4 rounded-xl border-sky-400/30 mb-2">
                    <p className="text-sky-800 font-bold italic text-center">
                      "La seguridad en la nube no es un destino, es un proceso continuo de vigilancia y adaptación."
                    </p>
                  </div>

                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="y2k-glass p-1 mb-4 grid grid-cols-4">
                      <TabsTrigger value="overview" className="data-[state=active]:y2k-glossy"><Activity className="mr-2 h-4 w-4" /> Resumen</TabsTrigger>
                      <TabsTrigger value="cloud" className="data-[state=active]:y2k-glossy"><Globe className="mr-2 h-4 w-4" /> Cloud Sec</TabsTrigger>
                      <TabsTrigger value="services" className="data-[state=active]:y2k-glossy"><Server className="mr-2 h-4 w-4" /> Equipos</TabsTrigger>
                      <TabsTrigger value="logs" className="data-[state=active]:y2k-glossy"><Terminal className="mr-2 h-4 w-4" /> Registros</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Card className="y2k-glass border-sky-100">
                          <CardHeader className="pb-2"><CardTitle className="text-sm font-mono uppercase text-gray-500">Estado de Red</CardTitle></CardHeader>
                          <CardContent>
                            <div className="text-2xl font-black text-sky-600 italic uppercase">Online</div>
                            <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden"><div className="h-full w-1/3 bg-sky-400" /></div>
                          </CardContent>
                        </Card>
                        <Card className="y2k-glass border-sky-100">
                          <CardHeader className="pb-2"><CardTitle className="text-sm font-mono uppercase text-gray-500">Nivel de Seguridad</CardTitle></CardHeader>
                          <CardContent>
                            <div className="text-2xl font-black text-blue-600 italic uppercase">Máximo</div>
                            <p className="text-[10px] text-gray-400 font-mono mt-1">AES-256 BIT ENCRYPTION</p>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <Card className="mt-6 y2k-glass border-sky-100 overflow-hidden">
                        <CardHeader>
                          <CardTitle className="text-lg italic uppercase">Bienvenido al Nodo Central</CardTitle>
                          <CardDescription>Has establecido una conexión segura con el servidor CyberBlue (SQLite Backend).</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="rounded-lg bg-gray-900/5 p-4 font-mono text-xs text-gray-600">
                            <p className="mb-1">{">"} Initializing secure handshake...</p>
                            <p className="mb-1">{">"} User ID: {user.id}</p>
                            <p className="mb-1">{">"} Role: {user.role}</p>
                            <p className="text-sky-600">{">"} Connection established. Ready for commands.</p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="cloud">
                      <Card className="y2k-glass border-sky-100">
                        <CardHeader>
                          <CardTitle className="text-lg italic uppercase">Cloud Security Dashboard</CardTitle>
                          <CardDescription>Monitoreo de infraestructura y cumplimiento.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 rounded-lg bg-sky-50 border border-sky-100">
                              <p className="text-[10px] font-mono text-sky-600 uppercase">Firewall Status</p>
                              <p className="font-bold text-gray-800">ACTIVO</p>
                            </div>
                            <div className="p-3 rounded-lg bg-sky-50 border border-sky-100">
                              <p className="text-[10px] font-mono text-sky-600 uppercase">DDoS Protection</p>
                              <p className="font-bold text-gray-800">STANDBY</p>
                            </div>
                            <div className="p-3 rounded-lg bg-sky-50 border border-sky-100">
                              <p className="text-[10px] font-mono text-sky-600 uppercase">IAM Policies</p>
                              <p className="font-bold text-gray-800">VERIFICADO</p>
                            </div>
                            <div className="p-3 rounded-lg bg-sky-50 border border-sky-100">
                              <p className="text-[10px] font-mono text-sky-600 uppercase">Data Residency</p>
                              <p className="font-bold text-gray-800">LOCAL SQLITE</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="services">
                      <Card className="y2k-glass border-sky-100">
                        <CardHeader className="flex flex-row items-center justify-between">
                          <div>
                            <CardTitle className="text-lg italic uppercase">Equipos a disposición</CardTitle>
                            <CardDescription>Inventario de hardware y nodos de seguridad activos.</CardDescription>
                          </div>
                          {user.role === 'admin' && !isAddingService && (
                            <Button size="sm" onClick={() => setIsAddingService(true)} className="y2k-button"><Plus className="h-4 w-4 mr-1" /> Nuevo</Button>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {isAddingService && (
                            <div className="p-4 rounded-xl border-2 border-sky-400 bg-sky-50 space-y-4">
                              <h3 className="font-bold uppercase text-sky-800 italic">Añadir Nuevo Equipo</h3>
                              <div className="space-y-2">
                                <Label>Título</Label>
                                <Input value={newService.title} onChange={(e) => setNewService({...newService, title: e.target.value})} placeholder="Ej: Endpoint Security" />
                              </div>
                              <div className="space-y-2">
                                <Label>Descripción</Label>
                                <Textarea value={newService.description} onChange={(e) => setNewService({...newService, description: e.target.value})} placeholder="Describe el equipo..." />
                              </div>
                              <div className="space-y-2">
                                <Label>Icono</Label>
                                <div className="grid grid-cols-6 gap-2 p-2 bg-white/50 rounded-lg border border-sky-100">
                                  {AVAILABLE_ICONS.map((icon) => (
                                    <button key={icon.name} onClick={() => setNewService({...newService, icon: icon.name})} className={`p-2 rounded-md flex items-center justify-center transition-all ${newService.icon === icon.name ? 'bg-sky-500 text-white shadow-inner' : 'hover:bg-sky-100 text-sky-600'}`}>
                                      <icon.icon className="h-5 w-5" />
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button onClick={handleAddService} className="y2k-button flex-1">Guardar</Button>
                                <Button variant="outline" onClick={() => setIsAddingService(false)} className="flex-1">Cancelar</Button>
                              </div>
                            </div>
                          )}

                          <div className="grid gap-4">
                            {services.map((service) => (
                              <div key={service.id} className="p-4 rounded-xl y2k-glass border-sky-200/50">
                                {editingService?.id === service.id ? (
                                  <div className="space-y-4">
                                    <Input value={editingService.title} onChange={(e) => setEditingService({...editingService, title: e.target.value})} />
                                    <Textarea value={editingService.description} onChange={(e) => setEditingService({...editingService, description: e.target.value})} />
                                    <div className="flex gap-2">
                                      <Button onClick={() => handleSaveService(service.id, editingService)} size="sm" className="y2k-button"><Save className="h-4 w-4 mr-1" /> Guardar</Button>
                                      <Button onClick={() => setEditingService(null)} size="sm" variant="outline"><X className="h-4 w-4 mr-1" /> Cancelar</Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-start justify-between gap-4">
                                      <div className="flex items-start gap-4">
                                        <div className="mt-1 p-2 rounded-lg bg-sky-100 text-sky-600"><IconRenderer name={service.icon} className="h-5 w-5" /></div>
                                        <div>
                                          <h4 className="font-bold text-gray-800 uppercase italic">{service.title}</h4>
                                          <p className="text-[10px] font-mono text-gray-400 mt-1 uppercase">Nodo ID: {service.id} // Verificado</p>
                                          
                                          {/* Recomendaciones Dinámicas */}
                                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                            <div className="p-2 rounded-lg bg-sky-50/50 border border-sky-100/50">
                                              <p className="text-[9px] font-mono text-sky-600 uppercase mb-1 flex items-center gap-1">
                                                <Terminal className="h-3 w-3" /> Recomendación de Implementación
                                              </p>
                                              <p className="text-[11px] leading-tight text-gray-700">
                                                {getSecurityAdvice(service.icon).rec}
                                              </p>
                                            </div>
                                            <div className="p-2 rounded-lg bg-blue-50/50 border border-blue-100/50">
                                              <p className="text-[9px] font-mono text-blue-600 uppercase mb-1 flex items-center gap-1">
                                                <Shield className="h-3 w-3" /> Protocolo de Seguridad
                                              </p>
                                              <p className="text-[11px] leading-tight text-gray-700">
                                                {getSecurityAdvice(service.icon).sec}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    {user.role === 'admin' && (
                                      <div className="flex flex-col gap-2">
                                        <Button size="icon" variant="ghost" onClick={() => setEditingService(service)} className="h-8 w-8 text-sky-600"><Edit className="h-4 w-4" /></Button>
                                        <Button size="icon" variant="ghost" onClick={() => handleDeleteService(service.id)} className="h-8 w-8 text-red-500"><Trash2 className="h-4 w-4" /></Button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="logs">
                      <Card className="y2k-glass border-sky-100">
                        <CardHeader>
                          <CardTitle className="text-lg italic uppercase">Registros de Actividad</CardTitle>
                          <CardDescription>Últimos eventos detectados en el sistema.</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {logs.map((log) => (
                              <div key={log.id} className="flex items-start gap-3 border-b border-gray-100 pb-2 last:border-0">
                                <div className="mt-1 h-2 w-2 rounded-full bg-sky-400" />
                                <div>
                                  <p className="text-sm font-bold text-gray-800">{log.action}</p>
                                  <p className="text-xs text-gray-500">{log.details}</p>
                                  <p className="text-[10px] font-mono text-gray-400 mt-1">{new Date(log.timestamp).toLocaleString()}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="space-y-6">
                  <Card className="y2k-glass border-sky-100">
                    <CardHeader><CardTitle className="text-lg italic uppercase flex items-center gap-2"><UserIcon className="h-5 w-5" /> Perfil</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-center">
                        <div className="relative">
                          <div className="h-20 w-20 rounded-full bg-sky-100 flex items-center justify-center border-4 border-white shadow-lg">
                            <UserIcon className="h-10 w-10 text-sky-500" />
                          </div>
                          <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-500 border-2 border-white" />
                        </div>
                      </div>
                      <div className="text-center">
                        <h3 className="font-bold text-gray-800">{user.displayName}</h3>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="y2k-glossy rounded-2xl p-6 text-center">
                    <p className="text-[10px] font-mono text-sky-700 uppercase tracking-[0.2em] mb-2">Publicidad Segura</p>
                    <h4 className="text-xl font-black italic text-gray-800 uppercase leading-tight">Protege tu <span className="text-sky-600">Futuro</span> Digital</h4>
                    <Button className="mt-4 w-full y2k-button text-xs uppercase font-bold">Más Información</Button>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </main>

        <footer className="mt-20 border-t border-gray-300 pt-8 pb-12 text-center">
          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">© 2004-2026 CyberBlue Security Systems // All Rights Reserved</p>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
