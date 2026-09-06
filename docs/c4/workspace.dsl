/*
 * Gerado por fernando-moretes/platform como ponto de partida. ESTE arquivo e
 * seu: o rollout so cria se nao existir, nunca sobrescreve.
 *
 * Modelo C4 de ref-aws-pattern-library. Renderize em https://c4.home.lab (Structurizr Lite)
 * ou cole em https://structurizr.com/dsl.
 */
workspace "ref-aws-pattern-library" "A curated catalog of 22+ AWS reference architectures with diagrams, ADRs, Well-Architected pointers and cost notes." {

    model {
        usuario = person "Usuário"
        sistema = softwareSystem "ref-aws-pattern-library" "A curated catalog of 22+ AWS reference architectures with diagrams, ADRs, Well-Architected pointers and cost notes." {
            app = container "Aplicação" "Descreva o que roda aqui" "ci-node.yml"
        }
        usuario -> sistema.app "Usa"
    }

    views {
        systemContext sistema "contexto" {
            include *
            autoLayout lr
        }
        container sistema "containers" {
            include *
            autoLayout lr
        }
        styles {
            element "Person" { shape person; background #08427b; color #ffffff }
            element "Software System" { background #1168bd; color #ffffff }
            element "Container" { background #438dd5; color #ffffff }
        }
    }
}
