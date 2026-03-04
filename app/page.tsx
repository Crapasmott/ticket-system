/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
  Search, Download, LogOut, User, Calendar,
  Laptop, CheckCircle, Building2, Monitor, Cpu,
} from 'lucide-react';

// ── CONSTANTES ───────────────────────────────────────────────────────────────
const EDIFICIOS = [
  'Edificio Principal (Bote)', 'Edificio Centro', 'Edificio Sur',
  'Edificio Occidente', 'Edificio Saire', 'Edificio Zona Norte',
  'Edificio Zona Rural', 'Subestacion Electrica', 'Oficinas Administrativas',
  'Almacen General', 'Taller de Mantenimiento', 'Centro de Control', 'Otro',
];

// ── TIPOS ────────────────────────────────────────────────────────────────────
type Tecnico = { id: number; nombre: string; usuario: string; role: string };
type Empleado = { id: number; nombre: string; cargo: string; dependencia: string; equipo: string; ip: string; tipo: string; serial?: string };
type TipoEquipo = 'ESCRITORIO' | 'PORTATIL' | 'AMBOS' | '';

interface CompRow {
  si: boolean;
  no: boolean;
  na: boolean;
  estado: string;
  serial: string;
}
type Componentes = Record<string, CompRow>;

const makeComponentes = (): Componentes => ({
  torre: { si: false, no: false, na: false, estado: '', serial: '' },
  monitor: { si: false, no: false, na: false, estado: '', serial: '' },
  teclado: { si: false, no: false, na: false, estado: '', serial: '' },
  mouse: { si: false, no: false, na: false, estado: '', serial: '' },
  cables: { si: false, no: false, na: false, estado: '', serial: '' },
  portatil: { si: false, no: false, na: false, estado: '', serial: '' },
});

interface FormData {
  fecha: string;
  edificio: string;
  otroEdificio: string;
  nombreEquipo: string;
  observaciones: string;
  componentes: Componentes;
}

const makeForm = (): FormData => ({
  fecha: new Date().toISOString().split('T')[0],
  edificio: '',
  otroEdificio: '',
  nombreEquipo: '',
  observaciones: '',
  componentes: makeComponentes(),
});

// ── FIRMA ────────────────────────────────────────────────────────────────────
function SignaturePad({
  onSave, label, resetKey,
}: {
  onSave: (d: string | null) => void;
  label: string;
  resetKey: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const [hasSig, setHasSig] = useState(false);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, c.width, c.height);
    setHasSig(false);
    onSave(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  const coords = (e: any, c: HTMLCanvasElement) => {
    const r = c.getBoundingClientRect();
    const cx = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const cy = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    return { x: (cx - r.left) * (c.width / r.width), y: (cy - r.top) * (c.height / r.height) };
  };

  const start = (e: any) => {
    e.preventDefault();
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const p = coords(e, c);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    drawing.current = true;
  };

  const move = (e: any) => {
    if (!drawing.current) return;
    e.preventDefault();
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const p = coords(e, c);
    ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const end = (e: any) => {
    if (!drawing.current) return;
    e.preventDefault();
    drawing.current = false;
    const c = canvasRef.current;
    if (!c) return;
    onSave(c.toDataURL());
    setHasSig(true);
  };

  const clear = () => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, c.width, c.height);
    onSave(null);
    setHasSig(false);
  };

  return (
    <div className="space-y-2 w-full">
      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">{label}</label>
      <div className={`border-2 rounded-xl transition-colors ${hasSig ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-white'}`}>
        <canvas
          ref={canvasRef} width={320} height={150}
          className="cursor-crosshair touch-none block rounded-xl"
          style={{ width: '100%', maxWidth: 320, height: 'auto' }}
          onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
          onTouchStart={start} onTouchMove={move} onTouchEnd={end} onTouchCancel={end}
        />
      </div>
      <div className="flex items-center justify-between px-1">
        <span className={`text-xs font-medium ${hasSig ? 'text-emerald-600' : 'text-slate-400'}`}>
          {hasSig ? 'Firma capturada' : 'Firme en el recuadro'}
        </span>
        <button type="button" onClick={clear} className="text-xs text-red-400 hover:text-red-600 font-medium px-3 py-1 rounded hover:bg-red-50 transition">
          Limpiar
        </button>
      </div>
    </div>
  );
}

// ── SELECTOR TIPO EQUIPO ─────────────────────────────────────────────────────
function EquipmentTypeSelector({ value, onChange }: { value: TipoEquipo; onChange: (v: TipoEquipo) => void }) {
  const opts: { key: TipoEquipo; label: string; desc: string; Icon: any; sel: string; icon: string; bg: string }[] = [
    { key: 'ESCRITORIO', label: 'PC de Mesa', desc: 'Torre + Monitor', Icon: Monitor, sel: 'border-orange-500 bg-orange-50 text-orange-700 shadow-md scale-105', icon: 'text-orange-500', bg: 'bg-orange-100' },
    { key: 'PORTATIL', label: 'Portatil', desc: 'Laptop', Icon: Laptop, sel: 'border-blue-500 bg-blue-50 text-blue-700 shadow-md scale-105', icon: 'text-blue-500', bg: 'bg-blue-100' },
    { key: 'AMBOS', label: 'Ambos', desc: 'Mesa + Portatil', Icon: Cpu, sel: 'border-purple-500 bg-purple-50 text-purple-700 shadow-md scale-105', icon: 'text-purple-500', bg: 'bg-purple-100' },
  ];
  return (
    <div>
      <p className="text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Tipo de equipo a mantener:</p>
      <div className="grid grid-cols-3 gap-2">
        {opts.map(({ key, label, desc, Icon, sel, icon, bg }) => {
          const selected = value === key;
          return (
            <button key={key} type="button" onClick={() => onChange(key)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 text-xs font-medium ${selected ? sel : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50'}`}>
              <div className={`p-2 rounded-lg ${selected ? bg : 'bg-slate-100'}`}>
                <Icon className={`w-5 h-5 ${selected ? icon : 'text-slate-400'}`} />
              </div>
              <span className="font-bold">{label}</span>
              <span className="text-[9px] opacity-70">{desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── PDF ──────────────────────────────────────────────────────────────────────
async function generarPDF(ticket: {
  id: number | string;
  fecha: string;
  edificio: string;
  tipoEquipo: string;
  nombreEquipo: string;
  observaciones: string;
  componentes: Componentes;
  empleado: Empleado;
  tecnico: Tecnico;
  firmas: { tecnico: string | null; usuario: string | null };
}) {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210; const margin = 14; let y = 14;

  const C = {
    indigo: [79, 70, 229] as [number, number, number],
    slate: [51, 65, 85] as [number, number, number],
    lgray: [241, 245, 249] as [number, number, number],
    white: [255, 255, 255] as [number, number, number],
    green: [16, 185, 129] as [number, number, number],
    red: [239, 68, 68] as [number, number, number],
    gray: [148, 163, 184] as [number, number, number],
    border: [203, 213, 225] as [number, number, number],
    amber: [245, 158, 11] as [number, number, number],
  };

  doc.setFillColor(...C.indigo); doc.rect(0, 0, W, 30, 'F');
  doc.setTextColor(...C.white);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(13);
  doc.text('FORMATO DE MANTENIMIENTO PREVENTIVO', margin, 12);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
  doc.text('ElectroHuila S.A. E.S.P.  |  FT-AGT-03-004', margin, 20);
  doc.text(`Ticket #${ticket.id}  |  ${ticket.fecha}`, W - margin, 20, { align: 'right' });
  y = 38;

  const section = (title: string) => {
    doc.setFillColor(...C.lgray); doc.rect(margin, y, W - margin * 2, 7, 'F');
    doc.setDrawColor(...C.border); doc.rect(margin, y, W - margin * 2, 7, 'S');
    doc.setTextColor(...C.indigo); doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
    doc.text(title, margin + 3, y + 5); y += 10;
    doc.setTextColor(...C.slate); doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5);
  };

  const row = (label: string, val: string, x2?: number, label2?: string, val2?: string) => {
    doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.setTextColor(100, 116, 139);
    doc.text(label + ':', margin + 2, y);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(...C.slate);
    doc.text(val || '-', margin + 32, y);
    if (x2 !== undefined && label2 && val2 !== undefined) {
      doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.setTextColor(100, 116, 139);
      doc.text(label2 + ':', x2, y);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(...C.slate);
      doc.text(val2 || '-', x2 + 32, y);
    }
    y += 6;
  };

  section('INFORMACION GENERAL');
  row('Fecha', ticket.fecha, 112, 'Edificio', ticket.edificio);
  row('Tipo Equipo', ticket.tipoEquipo, 112, 'Nombre Equipo', ticket.nombreEquipo || '-');
  y += 2;

  section('DATOS DEL USUARIO');
  row('Nombre', ticket.empleado.nombre, 112, 'Cargo', ticket.empleado.cargo);
  row('Dependencia', ticket.empleado.dependencia, 112, 'Equipo', ticket.empleado.equipo);
  row('IP', ticket.empleado.ip || '-');
  y += 2;

  section('TECNICO RESPONSABLE');
  row('Nombre', ticket.tecnico.nombre, 112, 'Rol', ticket.tecnico.role);
  y += 2;

  section('REVISION DE COMPONENTES');
  const tableW = W - margin * 2;
  const cols = [36, 13, 13, 13, 28, 33];
  const cX: number[] = [];
  cols.forEach((w, i) => cX.push(i === 0 ? margin : cX[i - 1] + cols[i - 1]));

  doc.setFillColor(...C.indigo); doc.rect(margin, y, tableW, 7, 'F');
  doc.setTextColor(...C.white); doc.setFont('helvetica', 'bold'); doc.setFontSize(7);
  ['Componente', 'SI', 'NO', 'N/A', 'Estado', 'Serial'].forEach((h, i) => {
    doc.text(h, i === 0 ? cX[i] + 2 : cX[i] + cols[i] / 2, y + 5, { align: i === 0 ? 'left' : 'center' });
  });
  y += 7;

  const COMP_NAMES: Record<string, string> = {
    torre: 'Torre / Carcasa', monitor: 'Monitor', teclado: 'Teclado',
    mouse: 'Mouse', cables: 'Cables', portatil: 'Portatil',
  };

  Object.entries(ticket.componentes).forEach(([key, val], idx) => {
    const bg = idx % 2 === 0 ? 248 : 255;
    doc.setFillColor(bg, bg === 248 ? 250 : 255, bg === 248 ? 252 : 255);
    doc.rect(margin, y, tableW, 7, 'F');
    doc.setDrawColor(...C.border); doc.rect(margin, y, tableW, 7, 'S');
    doc.setTextColor(...C.slate); doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5);
    doc.text(COMP_NAMES[key] ?? key, cX[0] + 2, y + 5);
    [val.si, val.no, val.na].forEach((checked, i) => {
      const color = checked ? (i === 0 ? C.green : i === 1 ? C.red : C.gray) : [210, 220, 230] as [number, number, number];
      doc.setTextColor(...color); doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
      doc.text(checked ? 'SI' : '-', cX[i + 1] + cols[i + 1] / 2, y + 5, { align: 'center' });
    });
    const eColor: Record<string, [number, number, number]> = { BUENO: C.green, REGULAR: C.amber, MALO: C.red };
    doc.setTextColor(...(eColor[val.estado] ?? C.gray));
    doc.setFont('helvetica', 'bold'); doc.setFontSize(7);
    doc.text(val.estado || '-', cX[4] + cols[4] / 2, y + 5, { align: 'center' });
    doc.setTextColor(...C.slate); doc.setFont('helvetica', 'normal'); doc.setFontSize(7);
    doc.text(val.serial || '-', cX[5] + 2, y + 5);
    y += 7;
  });
  y += 4;

  if (ticket.observaciones?.trim()) {
    section('OBSERVACIONES');
    doc.setTextColor(...C.slate); doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5);
    const lines = doc.splitTextToSize(ticket.observaciones, tableW - 4);
    doc.text(lines, margin + 2, y);
    y += (lines as string[]).length * 5 + 4;
  }

  if (y > 215) { doc.addPage(); y = 20; }
  section('FIRMAS DIGITALES');

  const sigW = 82; const sigH = 32; const sigY = y; const x2 = margin + sigW + 6;
  doc.setDrawColor(...C.border); doc.setFillColor(252, 252, 254);
  doc.roundedRect(margin, sigY, sigW, sigH + 12, 2, 2, 'FD');
  doc.roundedRect(x2, sigY, sigW, sigH + 12, 2, 2, 'FD');
  doc.setDrawColor(180, 190, 210);
  doc.line(margin + 4, sigY + sigH, margin + sigW - 4, sigY + sigH);
  doc.line(x2 + 4, sigY + sigH, x2 + sigW - 4, sigY + sigH);

  if (ticket.firmas.tecnico) {
    try { doc.addImage(ticket.firmas.tecnico, 'PNG', margin + 2, sigY + 2, sigW - 4, sigH - 6); }
    catch { /* skip */ }
  }
  if (ticket.firmas.usuario) {
    try { doc.addImage(ticket.firmas.usuario, 'PNG', x2 + 2, sigY + 2, sigW - 4, sigH - 6); }
    catch { /* skip */ }
  }

  doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.setTextColor(100, 116, 139);
  doc.text('FIRMA TECNICO', margin + sigW / 2, sigY + sigH + 5, { align: 'center' });
  doc.text('FIRMA USUARIO', x2 + sigW / 2, sigY + sigH + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); doc.setTextColor(150, 163, 175);
  const tn = ticket.tecnico.nombre.length > 30 ? ticket.tecnico.nombre.slice(0, 28) + '...' : ticket.tecnico.nombre;
  const en = ticket.empleado.nombre.length > 30 ? ticket.empleado.nombre.slice(0, 28) + '...' : ticket.empleado.nombre;
  doc.text(tn, margin + sigW / 2, sigY + sigH + 10, { align: 'center' });
  doc.text(en, x2 + sigW / 2, sigY + sigH + 10, { align: 'center' });

  doc.setFillColor(...C.indigo); doc.rect(0, 285, W, 12, 'F');
  doc.setTextColor(...C.white); doc.setFont('helvetica', 'normal'); doc.setFontSize(7);
  doc.text(
    `Generado el ${new Date().toLocaleDateString('es-CO')}  |  Sistema de Tickets ElectroHuila  |  FT-AGT-03-004`,
    W / 2, 292, { align: 'center' },
  );

  doc.save(`ticket-${ticket.id}-${ticket.empleado.nombre.split(' ')[0]}.pdf`);
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
  const [currentUser, setCurrentUser] = useState<Tecnico | null>(null);
  const [loadingTecs, setLoadingTecs] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Empleado[]>([]);
  const [showList, setShowList] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<Empleado | null>(null);
  const [tipoEquipo, setTipoEquipo] = useState<TipoEquipo>('');
  const [form, setForm] = useState<FormData>(makeForm());
  const [sigs, setSigs] = useState<{ tecnico: string | null; usuario: string | null }>({ tecnico: null, usuario: null });
  const [submitting, setSubmitting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [lastTicket, setLastTicket] = useState<any>(null);
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch('/api/tecnicos')
      .then(r => r.json()).then(setTecnicos).catch(() => setTecnicos([]))
      .finally(() => setLoadingTecs(false));
  }, []);

  const handleSearch = (v: string) => {
    setSearchTerm(v);
    if (searchRef.current) clearTimeout(searchRef.current);
    if (!v.trim()) { setSuggestions([]); setShowList(false); return; }
    searchRef.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const r = await fetch(`/api/empleados?q=${encodeURIComponent(v)}`);
        setSuggestions(await r.json()); setShowList(true);
      } catch { setSuggestions([]); }
      finally { setSearchLoading(false); }
    }, 300);
  };

  const selectEmp = (emp: Empleado) => {
    setSelectedEmp(emp);
    setTipoEquipo((emp.tipo as TipoEquipo) || '');
    setShowList(false); setSearchTerm('');
  };

  const setComp = (comp: string, field: keyof CompRow, value: string | boolean) => {
    setForm(prev => {
      const row = { ...prev.componentes[comp], [field]: value };
      if (field === 'si' && value === true) { row.no = false; row.na = false; }
      if (field === 'no' && value === true) { row.si = false; row.na = false; }
      if (field === 'na' && value === true) { row.si = false; row.no = false; }
      return { ...prev, componentes: { ...prev.componentes, [comp]: row } };
    });
  };

  const reset = () => {
    setForm(makeForm()); setSelectedEmp(null); setTipoEquipo('');
    setSigs({ tecnico: null, usuario: null }); setLastTicket(null);
  };

  const validate = () => {
    if (!selectedEmp) { alert('Selecciona un empleado'); return false; }
    if (!form.edificio) { alert('Selecciona un edificio'); return false; }
    if (form.edificio === 'Otro' && !form.otroEdificio.trim()) { alert('Especifica el edificio'); return false; }
    if (!tipoEquipo) { alert('Selecciona el tipo de equipo'); return false; }
    if (!sigs.tecnico || !sigs.usuario) { alert('Completa ambas firmas'); return false; }
    return true;
  };

  const buildData = () => ({
    id: lastTicket?.id ?? Date.now(),
    fecha: form.fecha,
    edificio: form.edificio === 'Otro' ? form.otroEdificio : form.edificio,
    tipoEquipo,
    nombreEquipo: form.nombreEquipo,
    observaciones: form.observaciones,
    componentes: form.componentes,
    empleado: selectedEmp!,
    tecnico: currentUser!,
    firmas: sigs,
  });

  const handleGuardar = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fecha: form.fecha,
          edificio: form.edificio === 'Otro' ? form.otroEdificio : form.edificio,
          tipoEquipo,
          nombreEquipo: form.nombreEquipo,
          observaciones: form.observaciones,
          componentes: form.componentes,
          firmaTecnico: sigs.tecnico,
          firmaUsuario: sigs.usuario,
          tecnicoId: currentUser!.id,
          empleadoId: selectedEmp!.id,
        }),
      });
      const ticket = await res.json();
      if (!res.ok) throw new Error(ticket.error || 'Error al guardar');
      setLastTicket({ ...buildData(), id: ticket.id });
      alert(`Ticket #${ticket.id} guardado correctamente`);
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePDF = async () => {
    if (!validate()) return;
    setGenerating(true);
    try { await generarPDF(buildData()); }
    catch (err: any) { alert('Error PDF: ' + err.message); }
    finally { setGenerating(false); }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Laptop className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Sistema de Tickets</h1>
            <p className="text-slate-400 mt-1 text-sm">Mantenimiento Preventivo - ElectroHuila</p>
          </div>
          <p className="text-xs font-bold text-slate-500 mb-4 text-center tracking-widest uppercase">Quien realiza el mantenimiento?</p>
          {loadingTecs ? (
            <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />)}</div>
          ) : tecnicos.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <User className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No se encontraron tecnicos</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tecnicos.map(tec => (
                <button key={tec.id} onClick={() => setCurrentUser(tec)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left group">
                  <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{tec.nombre}</p>
                    <p className="text-xs text-slate-400 capitalize mt-0.5">{tec.role}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Laptop className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">Tickets - ElectroHuila</h1>
              <p className="text-xs text-slate-400">FT-AGT-03-004</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800">{currentUser.nombre}</p>
              <p className="text-xs text-slate-400 capitalize">{currentUser.role}</p>
            </div>
            <button onClick={() => { setCurrentUser(null); reset(); }}
              className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Cambiar tecnico</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-5">
        {lastTicket && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <div>
                <p className="font-bold text-emerald-700 text-sm">Ticket #{lastTicket.id} guardado en la BD</p>
                <p className="text-xs text-emerald-600">Ahora puedes descargarlo en PDF</p>
              </div>
            </div>
            <button onClick={reset} className="text-xs text-emerald-600 hover:text-emerald-800 font-bold underline ml-4 whitespace-nowrap">
              Nuevo ticket
            </button>
          </div>
        )}

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-xs font-bold text-slate-500 mb-4 flex items-center gap-2 uppercase tracking-widest">
            <Calendar className="w-4 h-4 text-indigo-500" /> Informacion General
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Fecha</label>
              <input type="date" value={form.fecha}
                onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-slate-800 text-sm focus:ring-2 focus:ring-indigo-400 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                <Building2 className="w-3 h-3" /> Edificio
              </label>
              <select value={form.edificio}
                onChange={e => setForm(f => ({ ...f, edificio: e.target.value, otroEdificio: '' }))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-slate-800 text-sm focus:ring-2 focus:ring-indigo-400 outline-none">
                <option value="">Seleccionar...</option>
                {EDIFICIOS.map((ed, i) => <option key={i} value={ed}>{ed}</option>)}
              </select>
            </div>
            {form.edificio === 'Otro' && (
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Especificar</label>
                <input type="text" value={form.otroEdificio}
                  onChange={e => setForm(f => ({ ...f, otroEdificio: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-slate-800 text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                  placeholder="Nombre del edificio" />
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Nombre del Equipo</label>
              <input type="text" value={form.nombreEquipo}
                onChange={e => setForm(f => ({ ...f, nombreEquipo: e.target.value }))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-slate-800 text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                placeholder="Ej: 1BP2OJ-001" />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-xs font-bold text-slate-500 mb-4 flex items-center gap-2 uppercase tracking-widest">
            <User className="w-4 h-4 text-indigo-500" /> Seleccionar Usuario
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input type="text" value={searchTerm}
              onChange={e => handleSearch(e.target.value)}
              onFocus={() => { if (suggestions.length > 0) setShowList(true); }}
              placeholder="Buscar por nombre, cargo, dependencia o equipo..."
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 text-sm focus:ring-2 focus:ring-indigo-400 outline-none" />
            {showList && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-72 overflow-y-auto">
                {searchLoading
                  ? <p className="p-4 text-sm text-slate-400 text-center">Buscando...</p>
                  : suggestions.length > 0
                    ? <>
                      <div className="px-3 py-2 bg-slate-50 border-b sticky top-0">
                        <p className="text-xs text-slate-400 font-medium">{suggestions.length} resultado(s)</p>
                      </div>
                      {suggestions.map((emp, i) => (
                        <div key={i} onClick={() => selectEmp(emp)}
                          className="p-3 hover:bg-indigo-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors">
                          <p className="font-bold text-slate-800 text-sm">{emp.nombre}</p>
                          <p className="text-xs text-slate-500">{emp.cargo} - {emp.dependencia}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-slate-400">{emp.equipo}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${emp.tipo === 'PORTATIL' ? 'bg-blue-100 text-blue-600' : emp.tipo === 'AMBOS' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>
                              {emp.tipo}
                            </span>
                          </div>
                        </div>
                      ))}
                    </>
                    : <p className="p-4 text-sm text-slate-400 text-center">No se encontraron resultados</p>
                }
              </div>
            )}
          </div>

          {selectedEmp && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 bg-indigo-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-indigo-700" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{selectedEmp.nombre}</p>
                    <p className="text-xs text-slate-500">{selectedEmp.cargo}</p>
                  </div>
                </div>
                <div className="space-y-1 text-xs text-slate-600">
                  <p><span className="font-bold text-slate-700">Dependencia:</span> {selectedEmp.dependencia}</p>
                  <p><span className="font-bold text-slate-700">Equipo:</span> {selectedEmp.equipo}</p>
                  <p><span className="font-bold text-slate-700">IP:</span> {selectedEmp.ip || '-'}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="font-bold text-slate-700">Registrado:</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${selectedEmp.tipo === 'PORTATIL' ? 'bg-blue-100 text-blue-700' : selectedEmp.tipo === 'AMBOS' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                      {selectedEmp.tipo}
                    </span>
                  </div>
                </div>
                <button onClick={() => { setSelectedEmp(null); setTipoEquipo(''); }}
                  className="mt-3 text-xs text-indigo-500 hover:text-indigo-700 font-bold">
                  Cambiar empleado
                </button>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <EquipmentTypeSelector value={tipoEquipo} onChange={setTipoEquipo} />
                {tipoEquipo && tipoEquipo !== selectedEmp.tipo && (
                  <p className="mt-3 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    Difiere del tipo registrado ({selectedEmp.tipo})
                  </p>
                )}
              </div>
            </div>
          )}
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-xs font-bold text-slate-500 mb-4 flex items-center gap-2 uppercase tracking-widest">
            <CheckCircle className="w-4 h-4 text-indigo-500" /> Componentes
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">Elemento</th>
                  <th className="px-3 py-3 text-center text-xs font-bold text-emerald-600 uppercase w-12">SI</th>
                  <th className="px-3 py-3 text-center text-xs font-bold text-red-500 uppercase w-12">NO</th>
                  <th className="px-3 py-3 text-center text-xs font-bold text-slate-400 uppercase w-12">N/A</th>
                  <th className="px-3 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wide w-32">Estado</th>
                  <th className="px-3 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">Serial</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Object.keys(form.componentes).map(comp => (
                  <tr key={comp} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-semibold text-slate-700 capitalize">{comp}</td>
                    {(['si', 'no', 'na'] as const).map(field => (
                      <td key={field} className="px-3 py-3 text-center">
                        <input type="checkbox"
                          checked={form.componentes[comp][field] as boolean}
                          onChange={e => setComp(comp, field, e.target.checked)}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-400" />
                      </td>
                    ))}
                    <td className="px-3 py-3">
                      <select value={form.componentes[comp].estado}
                        onChange={e => setComp(comp, 'estado', e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 focus:ring-2 focus:ring-indigo-400 outline-none">
                        <option value="">Seleccionar...</option>
                        <option value="BUENO">Bueno</option>
                        <option value="REGULAR">Regular</option>
                        <option value="MALO">Malo</option>
                      </select>
                    </td>
                    <td className="px-3 py-3">
                      <input type="text"
                        value={form.componentes[comp].serial}
                        onChange={e => setComp(comp, 'serial', e.target.value)}
                        placeholder="Serial..."
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 focus:ring-2 focus:ring-indigo-400 outline-none min-w-[100px]" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest">Observaciones</h2>
          <textarea value={form.observaciones}
            onChange={e => setForm(f => ({ ...f, observaciones: e.target.value }))}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-indigo-400 outline-none resize-none"
            rows={3} placeholder="Describa el trabajo realizado, hallazgos o recomendaciones..." />
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-xs font-bold text-slate-500 mb-6 uppercase tracking-widest">Firmas Digitales</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <SignaturePad
              resetKey={`tec-${currentUser.id}`}
              label={`Firma del Tecnico: ${currentUser.nombre}`}
              onSave={sig => setSigs(s => ({ ...s, tecnico: sig }))}
            />
            <SignaturePad
              resetKey={`usr-${selectedEmp?.id ?? 'none'}`}
              label={`Firma del Usuario: ${selectedEmp?.nombre ?? 'Seleccionar usuario primero'}`}
              onSave={sig => setSigs(s => ({ ...s, usuario: sig }))}
            />
          </div>
        </section>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pb-8">
          <button onClick={handlePDF} disabled={generating}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition text-sm disabled:opacity-60">
            <Download className="w-5 h-5" />
            {generating ? 'Generando PDF...' : 'Descargar PDF'}
          </button>
          <button onClick={handleGuardar} disabled={submitting || !!lastTicket}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition text-sm disabled:opacity-60">
            <CheckCircle className="w-5 h-5" />
            {submitting ? 'Guardando...' : lastTicket ? 'Guardado en BD' : 'Guardar en BD'}
          </button>
        </div>
      </main>
    </div>
  );
}