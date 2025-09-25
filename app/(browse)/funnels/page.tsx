'use client';
import { faker } from '@faker-js/faker';
import { useHeader } from '../layout';
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from '@/components/ui/shadcn-io/kanban';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const shortDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'short',
  day: 'numeric',
});

const FunnelsPage = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);
  // Sem ações customizadas para esta página

  useEffect(() => {
    // Garantir que os dados sejam gerados apenas no cliente
    setIsClient(true);
    
    const generatedColumns = [
      { id: faker.string.uuid(), name: 'Leads', color: '#04CDD4' },
      { id: faker.string.uuid(), name: 'Qualificados', color: '#04CDD4' },
      { id: faker.string.uuid(), name: 'Propostas', color: '#04CDD4' },
      { id: faker.string.uuid(), name: 'Fechados', color: '#04CDD4' },
    ];

    const generatedUsers = Array.from({ length: 4 })
      .fill(null)
      .map(() => ({
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        image: faker.image.avatar(),
      }));

    const generatedLeads = Array.from({ length: 20 })
      .fill(null)
      .map(() => ({
        id: faker.string.uuid(),
        name: capitalize(faker.company.buzzPhrase()),
        startAt: faker.date.past({ years: 0.5, refDate: new Date() }),
        endAt: faker.date.future({ years: 0.5, refDate: new Date() }),
        column: faker.helpers.arrayElement(generatedColumns).id,
        owner: faker.helpers.arrayElement(generatedUsers),
      }));

    setColumns(generatedColumns);
    setUsers(generatedUsers);
    setLeads(generatedLeads);
  }, []);


  // Mostrar loading enquanto os dados não são carregados
  if (!isClient || columns.length === 0) {
    return (
      <div className="mx-4 mb-4 mt-2">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-4 mb-4 mt-2">
      <KanbanProvider
        columns={columns}
        data={leads}
        onDataChange={setLeads}
      >
        {(column) => (
          <KanbanBoard id={column.id} key={column.id}>
            <KanbanHeader>
              <div className="flex items-center gap-3">
                <div
                  className="h-3 w-3 rounded-full shadow-sm"
                  style={{ backgroundColor: column.color }}
                />
                <span className="font-semibold text-foreground">{column.name}</span>
                <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {leads.filter(lead => lead.column === column.id).length}
                </span>
              </div>
            </KanbanHeader>
            <KanbanCards id={column.id}>
              {(lead: (typeof leads)[number]) => (
                <KanbanCard
                  column={column.id}
                  id={lead.id}
                  key={lead.id}
                  name={lead.name}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-2 flex-1">
                      <p className="m-0 font-semibold text-sm text-foreground leading-tight">
                        {lead.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#04CDD4]"></div>
                        <p className="m-0 text-muted-foreground text-xs">
                          {shortDateFormatter.format(lead.startAt)} -{' '}
                          {dateFormatter.format(lead.endAt)}
                        </p>
                      </div>
                    </div>
                    {lead.owner && (
                      <Avatar className="h-6 w-6 shrink-0 border border-border/50">
                        <AvatarImage src={lead.owner.image} />
                        <AvatarFallback className="text-xs bg-[#04CDD410] text-foreground">
                          {lead.owner.name?.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </KanbanCard>
              )}
            </KanbanCards>
          </KanbanBoard>
        )}
      </KanbanProvider>
    </div>
  );
};

export default FunnelsPage;